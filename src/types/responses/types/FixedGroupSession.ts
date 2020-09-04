export interface Session {
	sessionId: number;
	category: number;
	roomSig: string;
	title: string;
	userIds: number[]
}