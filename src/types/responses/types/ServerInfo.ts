export interface ServerInfo {
	targetGroup: string;
	name: string;
	address: string;
	region: string;
	langCode: string;
	order: number;
	numPlayers: number;
	numSpectors: number;
	numMaxClients: number;
	visible: boolean;
	mirrorIndex: number;
	startTime: number;
	memoryUsage: number;
	serverVersion: string;
	altHostName: string;
	reportDate: number;
}
