class EnvironmentalVariable {
	PORT: number =
		parseInt(process.env.PORT);
	NODE_ENV: string =
		process.env.NODE_ENV || 'development';
	LOG_LEVEL: string =
		process.env.LOG_LEVEL || 'debug';
	IX_AGAR_STAT_MONGO_DB_HOSTNAME: string =
		process.env.IX_AGAR_STAT_MONGO_DB_HOSTNAME || 'localhost';
	IX_AGAR_STAT_MONGO_DB_USERNAME: string =
		process.env.IX_AGAR_STAT_MONGO_DB_USERNAME || 'root';
	IX_AGAR_STAT_MONGO_DB_PASSWORD: string =
		process.env.IX_AGAR_STAT_MONGO_DB_PASSWORD || 'example';
	IX_AGAR_STAT_MONGO_DB_DATABASE: string =
		process.env.IX_AGAR_STAT_MONGO_DB_DATABASE || 'ixagar';
	IX_AGAR_STAT_CHAT_LIST_ENDPOINT: string =
		process.env.IX_AGAR_STAT_CHAT_LIST_ENDPOINT || '';
	IX_AGAR_STAT_CHAT_WEBSOCKET_ENDPOINT: string =
		process.env.IX_AGAR_STAT_CHAT_WEBSOCKET_ENDPOINT || '';
	IX_AGAR_STAT_CHAT_SERVERSIG: string[] =
		process.env.IX_AGAR_STAT_CHAT_SERVERSIG?.split(',') || [];
	IX_AGAR_STAT_DISCORD_TOKEN: string =
		process.env.IX_AGAR_STAT_DISCORD_TOKEN || '';
	IX_AGAR_STAT_DISCORD_OWNER_ID: string =
		process.env.IX_AGAR_STAT_DISCORD_OWNER_ID || '';
	IX_AGAR_STAT_ENDPOINT: string =
		process.env.IX_AGAR_STAT_ENDPOINT || '';
}

export const env = new EnvironmentalVariable();
