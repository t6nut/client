import React, { useState, useEffect, useMemo, ChangeEvent, useCallback, useRef } from 'react';
import { getInfluencers } from '../services/api.ts';
import ErrorMessage from './ErrorMessage.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
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
		<Container maxWidth="md"> {/* Center the content */}
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
				<Typography variant="h5" component="h2" gutterBottom>
					Influencer List
				</Typography>

				<TextField
					label="Filter Influencers"
					variant="outlined"
					value={filter}
					onChange={handleFilterChange}
					sx={{ width: '100%', mb: 2 }} // Full width input
				/>

				{loading && <CircularProgress />} {/* MUI Loading Indicator */}

				{error && <ErrorMessage message={error} />}

				{!loading && (
					<List>
						{filteredInfluencers.map((influencer) => (
							<ListItem key={influencer.id} divider>
								<InfluencerComponent influencer={influencer} />
							</ListItem>
						))}
					</List>
				)}
			</Box>
		</Container>
	);
};

export default InfluencerList;
