import React from 'react';
import { Influencer as IInfluencer } from '../services/api'; // Import as IInfluencer

// Now, rename your component to something like InfluencerComponent
const InfluencerComponent: React.FC<{ influencer: IInfluencer }> = ({ influencer }) => { // Use IInfluencer type here

	return (
		<div>
			<h3>{influencer.firstName} {influencer.lastName}</h3>
			{/* Display other influencer properties */}
			<ul>
				{influencer.socialMediaAccounts.map((account) => (
					<li key={account.username}>
						{account.platform}: {account.username}
					</li>
				))}
			</ul>

			{influencer.manager && ( // Conditionally render manager info
				<p>Manager: {influencer.manager.name}</p>
			)}
		</div>
	);

};

export default InfluencerComponent; // Export the correctly named component
