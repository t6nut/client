import React, { useState, useEffect, useMemo, ChangeEvent, useCallback, useRef } from 'react';
import { getInfluencers, assignManager, getManagers } from '../services/api.ts'; // Import functions
import ErrorMessage from './ErrorMessage.tsx';
import InfluencerComponent from './Influencer.tsx';
import debounce from 'lodash.debounce';
import { Box, Container, TextField, Typography, CircularProgress, List, ListItem } from '@mui/material';

interface IInfluencer {
	id: number;
	firstName: string;
	lastName: string;
	socialMediaAccounts: { platform: 'instagram' | 'tiktok'; username: string }[];
	manager?: { id: number; name: string };
}

interface IManager {
	id: number;
	name: string;
}

const InfluencerList: React.FC<{
	refreshListProp: boolean;
	setRefreshListProp: React.Dispatch<React.SetStateAction<boolean>>;
	filter: string; // Accept filter as a prop
	setFilter: React.Dispatch<React.SetStateAction<string>>; // Accept setFilter as a prop
}> = ({ refreshListProp, setRefreshListProp, filter, setFilter }) => {
	const [influencers, setInfluencers] = useState<IInfluencer[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const mountedRef = useRef(false);
	const [managers, setManagers] = useState<IManager[]>([]);
	const [assignLoading, setAssignLoading] = useState(false);

	useEffect(() => {
		const fetchManagers = async () => {
			try {
				const managerData = await getManagers(); // Fetch managers from API
				setManagers(managerData);
			} catch (error) {
				setError(error.message || 'Failed to fetch managers');
			}
		};
		fetchManagers();
	}, []);

	const handleAssignManager = async (influencerId: number, managerId: number | null) => {
		setAssignLoading(true);
		try {
			await assignManager(influencerId, managerId); // Call with managerId or null
			setRefreshListProp(true); // Refresh the influencer list
		} catch (error) {
			setError(error.message || 'Failed to assign/unassign manager');
		} finally {
			setAssignLoading(false);
		}
	};

	const fetchInfluencers = useCallback(async (filterValue = '') => {
		if (!mountedRef.current) return;
		setLoading(true);
		try {
			const data = await getInfluencers(filterValue);
			setInfluencers(data);
		} catch (error) {
			setError(error.message || 'Failed to fetch influencers');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		mountedRef.current = true;
		fetchInfluencers(filter);

		return () => {
			mountedRef.current = false;
		};
	}, [fetchInfluencers, filter]);

	useEffect(() => {
		if (refreshListProp) {
			const refresh = async () => {
				try {
					await fetchInfluencers(filter);
				} finally {
					setRefreshListProp(false);
				}
			};
			refresh();
		}
	}, [refreshListProp, setRefreshListProp, fetchInfluencers, filter]);

	const debouncedSetFilter = useMemo(() => debounce(setFilter, 10), [setFilter]);

	useEffect(() => {
		return () => {
			debouncedSetFilter.cancel();
		};
	}, [debouncedSetFilter]);

	const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
		debouncedSetFilter(event.target.value);
	};

	const filteredInfluencers = useMemo(() => {
		return influencers.filter((influencer) => {
			const fullName = `${influencer.firstName} ${influencer.lastName}`.toLowerCase();
			return fullName.includes(filter.toLowerCase());
		});
	}, [influencers, filter]);

	return (
		<Container maxWidth="md">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					mt: 4,
					paddingTop: 10,
					position: 'relative', // To make the search input stay on top
					minHeight: '100vh', // Ensure the container takes up at least the full screen height
				}}
			>
				<Typography variant="h4" component="h2" gutterBottom>
					Influencer List
				</Typography>

				{/* Search input stays on top */}
				<TextField
					label="Filter Influencers"
					variant="outlined"
					value={filter}
					onChange={handleFilterChange}
					sx={{
						width: '100%',
						mb: 2,
						position: 'sticky', // Sticky positioning
						top: 0, // Always stay on top
						zIndex: 1, // Ensure it stays above the list
						'& .MuiOutlinedInput-root': {
							'&.Mui-focused fieldset': {
								borderColor: '#aeffde', // Change border color on focus
							},
						},
						'& .MuiInputLabel-root': {
							'&.Mui-focused': {
								color: '#aeffde', // Change label color on focus
							},
						},
					}}
				/>

				{loading && <CircularProgress sx={{ mt: 2 }} />} {/* MUI Loading Indicator */}
				{error && <ErrorMessage message={error} />}

				{/* List container with scrollable feature */}
				<Box
					sx={{
						width: '100%',
						maxHeight: 'calc(100vh - 120px)',
						overflowY: 'auto',
						borderRadius: 2,
						border: '1px solid #ebff08',
						boxShadow: 3,
						paddingTop: 2,
					}}
				>
					{!loading && (
						<List>
							{filteredInfluencers.map((influencer) => (
								<ListItem
									key={influencer.id}
									divider
									sx={{ display: 'flex', justifyContent: 'space-between' }}
								>
									<InfluencerComponent
										key={influencer.id}
										influencer={influencer}
										managers={managers}
										onAssignManager={handleAssignManager}
										assignLoading={assignLoading}
									/>
									{/* New column for manager */}
									<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
										{influencer.manager ? (
											<Typography variant="body2" sx={{ color: 'text.secondary' }}>
												Manager: {influencer.manager.name}
											</Typography>
										) : (
											<Typography variant="body2" sx={{ color: 'text.secondary' }}>
												No manager assigned
											</Typography>
										)}
									</Box>
								</ListItem>
							))}
						</List>
					)}
				</Box>
			</Box>
		</Container>
	);
};

export default InfluencerList;
