import { DiscordService } from './discord/index';
import { ExpressService } from './express/index';
import { ChatServerHandler } from './sockets';
import config from '../config.json';

(async () => {

	//
	// ─── SERVER HANDLER ─────────────────────────────────────────────────────────────
	//
	const serverHandler = new ChatServerHandler(config.servers);
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
