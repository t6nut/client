import { Influencer } from './types.ts';

export interface IInfluencer { // Make sure this matches your backend data
	id: number;
	firstName: string;
	lastName: string;
	// ...other properties
}

// Replace with your actual API URL and implementation
export const getInfluencers = async (filter: string): Promise<IInfluencer[]> => {
	try {
		const response = await fetch(`http://localhost:3001/influencers?filter=${filter}`); // Adjust URL as needed
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching influencers:", error);
		throw error;
	}

};


// Add other API functions (createInfluencer, updateInfluencer, etc.)


export const createInfluencer = async (influencerData: IInfluencer): Promise<IInfluencer> => {
	try {
		const response = await fetch('http://localhost:3001/influencers', {  // POST request
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(influencerData),
		});

		if (!response.ok) {
			// Check if there is a JSON error response
			try {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to create influencer.');
			} catch (jsonError) {
				// If there was a problem parsing the JSON, perhaps a server crash, then throw original error
				throw new Error('Failed to create influencer.');
			}
		}

		return await response.json();
	} catch (error) {
		console.error('Error creating influencer:', error); // Log the detailed error
		throw error; // Re-throw to be handled by the component
	}
};



