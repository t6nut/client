import React, { useState, useEffect, useMemo, ChangeEvent, useCallback } from 'react';
import { getInfluencers } from '../services/api.ts';
import ErrorMessage from './ErrorMessage.tsx';
import LoadingSpinner from './LoadingSpinner.tsx'; // Import LoadingSpinner
import InfluencerComponent from './Influencer.tsx';
import debounce from 'lodash.debounce'; // Import debounce (install if needed: npm install lodash.debounce)


// Define your Influencer interface (replace with your actual properties)
interface IInfluencer {
	id: number;
	firstName: string;
	lastName: string;
	socialMediaAccounts: { platform: 'instagram' | 'tiktok'; username: string }[];
	manager?: { id: number; name: string }; // Optional manager
}

const InfluencerList: React.FC<{ refreshListProp: boolean; setRefreshListProp: React.Dispatch<React.SetStateAction<boolean>> }> = ({ refreshListProp, setRefreshListProp }) => {
	const [influencers, setInfluencers] = useState<IInfluencer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState('');


	const fetchInfluencers = useCallback(async (filterValue = "") => {
		try {
			setLoading(true);
			const data = await getInfluencers(filterValue);
			setInfluencers(data);
		} catch (error) {
			setError(error.message || 'Failed to fetch influencers');
		} finally {
			setLoading(false);
		}
	}, []);


	const debouncedFetch = useCallback(
		debounce((filterValue) => { fetchInfluencers(filterValue); }, 300), // Debounce the fetch call directly
		[fetchInfluencers]
	);


	useEffect(() => {
		debouncedFetch(filter);
	}, [filter, debouncedFetch]);  // Correct dependencies


	useEffect(() => {
		if (refreshListProp || !influencers.length) { // Only fetch if refresh needed OR initial load
			const refresh = async () => {
				try {
					await fetchInfluencers(filter);
				} finally {
					setRefreshListProp(false); // Use the prop setter directly!  Crucial change
				}
			};
			refresh();

		}
	}, [refreshListProp, setRefreshListProp, fetchInfluencers, filter]); // Add filter here

	const handleFilterChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	}, []);


	// Use useMemo to calculate filteredInfluencers only when influencers or filter changes
	const filteredInfluencers = useMemo(() => {
		return influencers.filter((influencer) => {
			const fullName = `${influencer.firstName} ${influencer.lastName}`.toLowerCase();
			return fullName.includes(filter.toLowerCase());
		});

	}, [influencers, filter]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorMessage message={error} />;
	}


	// Basic influencer display (customize as needed)
	return (
		<div>
			<input type="text" value={filter} onChange={handleFilterChange} placeholder="Filter influencers" />

			{filteredInfluencers.map((influencer) => (
				<InfluencerComponent key={influencer.id} influencer={influencer} />
			))}

		</div>
	);

};

export default InfluencerList;
