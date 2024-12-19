import React, { useState, useEffect } from 'react';
import { getInfluencers } from '../services/api.ts';
import ErrorMessage from './ErrorMessage.tsx';
import LoadingSpinner from './LoadingSpinner.tsx'; // Import LoadingSpinner
import InfluencerComponent from './Influencer.tsx';

// Define your Influencer interface (replace with your actual properties)
interface IInfluencer {
	id: number;
	firstName: string;
	lastName: string;
	socialMediaAccounts: { platform: 'instagram' | 'tiktok'; username: string }[];
	manager?: { id: number; name: string }; // Optional manager
}

const InfluencerList: React.FC = () => {  // Use React.FC for better type checking
	const [influencers, setInfluencers] = useState<IInfluencer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState('');
	const [filteredInfluencers, setFilteredInfluencers] = useState<IInfluencer[]>([]); // New state for filtered data


	useEffect(() => {
		const fetchInfluencers = async () => {
			setLoading(true);
			const data = await getInfluencers(filter);
			try {
				setInfluencers(data);
			} catch (err) {
				setError('Error fetching data. Please try again later.');
			} finally {
				setLoading(false);
			}
			setFilteredInfluencers(data); // Update the filtered list
		};
		fetchInfluencers();
	}, [filter]);

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};



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

			{influencers.map((influencer) => (
				<InfluencerComponent key={influencer.id} influencer={influencer} />
			))}

		</div>
	);

};

export default InfluencerList;
