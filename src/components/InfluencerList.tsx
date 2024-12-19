import React, { useState, useEffect, useMemo, ChangeEvent, useCallback, useRef } from 'react';
import { getInfluencers } from '../services/api.ts';
import ErrorMessage from './ErrorMessage.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import InfluencerComponent from './Influencer.tsx';
import debounce from 'lodash.debounce';

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
		<div>
			<div>
				<input
					type="text"
					value={filter}
					onChange={handleFilterChange}
					placeholder="Filter influencers"
				/>
			</div>

			{/* Only show the spinner outside the input field */}
			{loading && <div style={{ marginTop: '10px' }}><LoadingSpinner /></div>}

			{error && <ErrorMessage message={error} />}

			{!loading &&
				filteredInfluencers.map((influencer) => (
					<InfluencerComponent key={influencer.id} influencer={influencer} />
				))}
		</div>
	);
};

export default InfluencerList;
