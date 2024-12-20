export interface IManager {
	id: number;
	name: string;
}

export interface ISocialMediaAccount {
	platform: 'instagram' | 'tiktok'; // Adjust according to your platform list
	username: string;
}

export interface IInfluencer {
	id: number;
	firstName: string;
	lastName: string;
	socialMediaAccounts: ISocialMediaAccount[];
	manager: IManager | null; // Manager can be null if not assigned
}

// Fetch all influencers (remove filter logic here for simplicity)
export const getInfluencers = async (): Promise<IInfluencer[]> => {
	try {
		const response = await fetch('http://localhost:3001/influencers'); // No filter in the URL
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching influencers:", error);
		throw error;
	}
};

// Fetch all managers
export const getManagers = async (): Promise<IManager[]> => {
	try {
		const response = await fetch('http://localhost:3001/managers');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching managers:", error);
		throw error;
	}
};

// Assign a manager to an influencer (using PATCH instead of PUT)
export const assignManager = async (influencerId: number, managerId: number | null): Promise<IInfluencer> => {
	try {
		const response = await fetch(`http://localhost:3001/influencers/${influencerId}/manager`, {
			method: 'PATCH', // Use PATCH method to match your Express API
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ managerId }), // Send managerId in the request body
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to assign manager.');
		}

		return await response.json(); // Return the updated influencer object
	} catch (error) {
		console.error("Error assigning manager:", error);
		throw error;
	}
};

// Unassign the manager from an influencer
export const unassignManager = async (influencerId: number): Promise<IInfluencer> => {
	return assignManager(influencerId, null); // Reuse the assignManager function with null managerId
};

// Create a new influencer
export const createInfluencer = async (influencerData: IInfluencer): Promise<IInfluencer> => {
	try {
		const response = await fetch('http://localhost:3001/influencers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(influencerData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to create influencer.');
		}

		return await response.json(); // Return the created influencer
	} catch (error) {
		console.error('Error creating influencer:', error);
		throw error;
	}
};
