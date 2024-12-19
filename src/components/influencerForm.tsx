import React, { useState } from 'react';
import { createInfluencer } from '../services/api.ts'; // Import your API function

interface SocialMediaAccount {
	platform: 'instagram' | 'tiktok';
	username: string;
}

const InfluencerForm: React.FC = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([]);
	const [error, setError] = useState<string | null>(null); // For error messages

	const handleAddSocialMediaAccount = () => {
		setSocialMediaAccounts([...socialMediaAccounts, { platform: 'instagram', username: '' }]);
	};

	const handleSocialMediaAccountChange = (index: number, field: keyof SocialMediaAccount, value: string) => {
		const updatedAccounts = [...socialMediaAccounts];
		updatedAccounts[index][field] = value;
		setSocialMediaAccounts(updatedAccounts);
	};



	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);  // Clear any previous errors


		try {
			const newInfluencer = {
				firstName,
				lastName,
				socialMediaAccounts,

			};


			await createInfluencer(newInfluencer);


			// Reset form after successful submission
			setFirstName('');
			setLastName('');
			setSocialMediaAccounts([]);


		} catch (err) {

			// Display the error message from the API response or a generic message
			setError(err?.message || 'Failed to create influencer.');

		}

	};




	return (
		<form onSubmit={handleSubmit}>
			{/*Error message handling*/}
			{error && (
				<div style={{ color: 'red' }}>{error}</div>
			)}
			<div>
				<label htmlFor="firstName">First Name:</label>
				<input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} maxLength={50} required /> {/* Enforce max length */}
			</div>
			<div>
				<label htmlFor="lastName">Last Name:</label>
				<input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} maxLength={50} required />
			</div>


			{/*Dynamic social media account inputs*/}
			{socialMediaAccounts.map((account, index) => (

				<div key={index}>
					<select value={account.platform} onChange={e => handleSocialMediaAccountChange(index, 'platform', e.target.value)}>
						<option value="instagram">Instagram</option>
						<option value="tiktok">TikTok</option>
					</select>

					<input type="text" value={account.username} onChange={e => handleSocialMediaAccountChange(index, 'username', e.target.value)} placeholder="Username" />



				</div>
			))}
			<button type="button" onClick={handleAddSocialMediaAccount}>Add Social Media Account</button> {/*Add account button*/}


			<button type="submit">Create Influencer</button>
		</form>
	);
};


export default InfluencerForm;
