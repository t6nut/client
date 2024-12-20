import React, { useState, useEffect } from 'react';
import { IInfluencer } from '../services/api.ts';
import { IManager } from '../services/types.ts';
import { Typography, Box, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from '@mui/material';

interface InfluencerComponentProps {
	influencer: IInfluencer;
	managers: IManager[];
	onAssignManager: (influencerId: number, managerId: number | null) => Promise<void>;
	assignLoading: boolean;
}

const InfluencerComponent: React.FC<InfluencerComponentProps> = ({
	influencer,
	managers,
	onAssignManager,
	assignLoading,
}) => {
	const [selectedManager, setSelectedManager] = useState<number | null>(
		influencer.manager?.id || null
	);

	const handleManagerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectedManager(event.target.value as number | null);
	};

	const handleAssign = async () => {
		await onAssignManager(influencer.id, selectedManager);
	};

	return (
		<div>
			<Typography variant="h4" sx={{ color: '#ebff08', mb: 2 }}>
				{influencer.firstName} {influencer.lastName}
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
				{/* Left column for influencer details */}
				<Box sx={{ flex: 1 }}>
					<List sx={{ pl: 2, paddingLeft: 0 }}>
						{influencer.socialMediaAccounts.map((account) => (
							<ListItem key={account.username} sx={{ color: '#aeffde' }}>
								<ListItemText
									primary={`${account.platform}: ${account.username}`}
									sx={{
										'& .MuiListItemText-primary': {
											fontWeight: 500,
										},
									}}
								/>
							</ListItem>
						))}
					</List>
				</Box>

				{/* Right column for manager dropdown and button */}
				<Box sx={{ flex: 1, ml: 4 }}>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel id={`manager-label-${influencer.id}`} sx={{ color: '#aeffde' }}>
							Manager
						</InputLabel>
						<Select
							labelId={`manager-label-${influencer.id}`}
							value={selectedManager || ''}
							onChange={handleManagerChange}
							label="Manager"
							disabled={assignLoading}
							sx={{
								'& .MuiOutlinedInput-root': {
									'&.Mui-focused fieldset': {
										borderColor: '#aeffde', // Set focus border color
									},
								},
								'& .MuiInputLabel-root': {
									'&.Mui-focused': {
										color: '#aeffde', // Change label color on focus
									},
								},
							}}
							renderValue={(value) =>
								value !== '' ? managers.find((m) => m.id === value)?.name || 'None' : 'None'
							}
						>
							<MenuItem value={null}>None</MenuItem>
							{managers.map((manager) => (
								<MenuItem key={manager.id} value={manager.id}>
									{manager.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{assignLoading ? (
						<CircularProgress size={24} />
					) : (
						<Button
							onClick={handleAssign}
							disabled={selectedManager === influencer.manager?.id}
							variant="contained"
							sx={{
								backgroundColor: '#ebff08', // Button color
								'&:hover': {
									backgroundColor: '#c7e700', // Hover color
								},
								color: '#000', // Text color for button
								size: 'small',
							}}
						>
							{influencer.manager ? 'Update' : 'Assign'}
						</Button>
					)}
				</Box>
			</Box>
		</div>

	);
};

export default InfluencerComponent;
