import React, { useState, useEffect } from 'react';
import { IInfluencer } from '../services/api.ts';
import { IManager } from '../services/types.ts';
import { Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from '@mui/material';

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
			<h3>
				{influencer.firstName} {influencer.lastName}
			</h3>
			<ul>
				{influencer.socialMediaAccounts.map((account) => (
					<li key={account.username}>
						{account.platform}: {account.username}
					</li>
				))}
			</ul>

			<FormControl fullWidth>
				<InputLabel id={`manager-label-${influencer.id}`}>Manager</InputLabel>
				<Select
					labelId={`manager-label-${influencer.id}`}
					value={selectedManager || ''}
					onChange={handleManagerChange}
					label="Manager"
					disabled={assignLoading}
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
					color="primary"
					size="small"
				>
					{influencer.manager ? 'Update' : 'Assign'}
				</Button>
			)}
		</div>
	);
};

export default InfluencerComponent;
