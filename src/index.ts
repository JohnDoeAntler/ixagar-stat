import { DiscordService } from './discord/index';
import { ExpressService } from './express/index';
import { ChatServerHandler } from './sockets';
import { env } from './utils/env';

(async () => {

	//
	// ─── SERVER HANDLER ─────────────────────────────────────────────────────────────
	//
	const serverHandler = new ChatServerHandler(env.IX_AGAR_STAT_CHAT_SERVERSIG);
	serverHandler.run();

	//
	// ─── EXPRESS ────────────────────────────────────────────────────────────────────
	//
	const ipTracker = new ExpressService(serverHandler);
	ipTracker.run();

	//
	// ─── DISCORD ────────────────────────────────────────────────────────────────────
	//
	const client = new DiscordService(serverHandler.getServers());
	client.run();

})();
