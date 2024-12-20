import React, { useState } from 'react';
import { createInfluencer } from '../services/api.ts'; // Import your API function
import { Box, Button, Container, TextField, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


interface SocialMediaAccount {
	platform: 'instagram' | 'tiktok';
	username: string;
}

const InfluencerForm: React.FC<{ refreshListProp: React.Dispatch<React.SetStateAction<boolean>> }> = ({ refreshListProp }) => { // Receive the prop
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([]);
	const [error, setError] = useState<string | null>(null); // For error messages

	const handleAddSocialMediaAccount = () => {
		setSocialMediaAccounts([...socialMediaAccounts, { platform: 'instagram', username: '' }]);
	};

	const handleRemoveSocialMediaAccount = (index: number) => {
		const updatedAccounts = [...socialMediaAccounts];
		updatedAccounts.splice(index, 1);
		setSocialMediaAccounts(updatedAccounts);
	};

	const handleSocialMediaAccountChange = (index: number, field: keyof SocialMediaAccount, value: string) => {
		const updatedAccounts = [...socialMediaAccounts];
		updatedAccounts[index][field] = value;
		setSocialMediaAccounts(updatedAccounts);
	};



	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);  // Clear any previous errors

		// Input validation:
		if (firstName.length > 50 || lastName.length > 50) {
			setError("First and last names cannot exceed 50 characters.");
			return;
		}

		const uniqueAccounts = new Set();
		for (const account of socialMediaAccounts) {
			const key = `${account.platform}-${account.username}`;
			if (uniqueAccounts.has(key)) {
				setError("Duplicate social media accounts are not allowed.");
				return;
			}
			uniqueAccounts.add(key);
		}

		try {
			const newInfluencer = {
				firstName,
				lastName,
				socialMediaAccounts,
			};

			await createInfluencer(newInfluencer);
			refreshListProp(true);

			// Reset form
			setFirstName('');
			setLastName('');
			setSocialMediaAccounts([]);
		} catch (err) {
			setError(err?.message || 'Failed to create influencer.');
		}

	};




	return (
		<Container maxWidth="sm">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					mt: 4,
					bgcolor: 'background.default', // Use theme background for dark mode
					color: 'text.primary', // Use theme text for dark mode
					p: 3,
					borderRadius: 2,
					border: '1px solid #ebff08',
					boxShadow: 3,
				}}
			>
				<Typography variant="h4" component="h2" gutterBottom>
					Create Influencer
				</Typography>

				<form onSubmit={handleSubmit}>
					{error && (
						<Typography color="error" variant="body2" sx={{ mb: 2 }}>
							{error}
						</Typography>
					)}

					<TextField
						label="First Name"
						variant="outlined"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						inputProps={{ maxLength: 50 }}
						required
						fullWidth
						sx={{ width: '100%', mb: 2 }}
					/>

					<TextField
						label="Last Name"
						variant="outlined"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						inputProps={{ maxLength: 50 }}
						required
						fullWidth
						sx={{ width: '100%', mb: 2 }}
					/>

					{socialMediaAccounts.map((account, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								gap: 2,
								alignItems: 'center',
								mb: 2,
							}}
						>
							<FormControl fullWidth sx={{ flex: 1 }}>
								<InputLabel id={`platform-label-${index}`}>Platform</InputLabel>
								<Select
									labelId={`platform-label-${index}`}
									value={account.platform}
									onChange={(e) =>
										handleSocialMediaAccountChange(index, 'platform', e.target.value)
									}
									label="Platform"
								>
									<MenuItem value="instagram">Instagram</MenuItem>
									<MenuItem value="tiktok">TikTok</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label="Username"
								variant="outlined"
								value={account.username}
								onChange={(e) =>
									handleSocialMediaAccountChange(index, 'username', e.target.value)
								}
								fullWidth
								sx={{ flex: 3 }}
							/>
							<IconButton
								onClick={() => handleRemoveSocialMediaAccount(index)}
								aria-label="delete"
								size="small"
							>
								<DeleteIcon fontSize="inherit" />
							</IconButton>
						</Box>
					))}

					<Button
						variant="contained"
						onClick={handleAddSocialMediaAccount}
						sx={{ mb: 2 }}
					>
						Add Social Media Account
					</Button>

					<Button variant="contained" color="primary" type="submit" fullWidth>
						Create Influencer
					</Button>
				</form>
			</Box>
		</Container>
	);
};


export default InfluencerForm;
