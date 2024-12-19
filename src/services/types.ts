export interface Influencer { // Make sure this matches your backend data
	id: number;
	firstName: string;
	lastName: string;
	socialMediaAccounts: { platform: 'instagram' | 'tiktok'; username: string }[];
	manager?: { id: number; name: string }; // Optional manager
}
