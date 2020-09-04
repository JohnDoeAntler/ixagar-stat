import { DiscordService } from './discord/index';
import { server } from './express/index';
import { ChatServerHandler } from './sockets';
import { env } from './utils/env';

(async () => {
	//
	// ─── EXPRESS ────────────────────────────────────────────────────────────────────
	//
	await server.run();

	//
	// ─── SERVER HANDLER ─────────────────────────────────────────────────────────────
	//
	const serverHandler = new ChatServerHandler(env.IX_AGAR_STAT_CHAT_SERVERSIG);
	serverHandler.run();

	//
	// ─── DISCORD ────────────────────────────────────────────────────────────────────
	//
	const client = new DiscordService(serverHandler.getServers());
	client.run();

})();
