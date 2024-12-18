import { Influencer } from './types'; // Define your types

export async function getInfluencers(filter = ''): Promise<Influencer[]> {
	try {
		const response = await fetch(`/influencers?filter=${filter}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`); // Or custom error handling
		}
		return await response.json();
	} catch (error) {
		// Handle errors, e.g., set an error state in your component
		console.error("Error fetching influencers:", error);
		throw error; // Re-throw to be handled in the component
	}
}

// ... other API functions (createInfluencer, updateInfluencer, etc.)
