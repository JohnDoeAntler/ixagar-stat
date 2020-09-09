import { DiscordService } from './discord/index';
import { ExpressService } from './express/index';
import { IXAgarServerHandler } from './sockets';
import config from '../config.json';

(async () => {

	//
	// ─── SERVER HANDLER ─────────────────────────────────────────────────────────────
	//
	const serverHandler = new IXAgarServerHandler(config.servers);
	serverHandler.run();

	//
	// ─── EXPRESS ────────────────────────────────────────────────────────────────────
	//
	const ipTracker = new ExpressService(serverHandler);
	await ipTracker.run();

	//
	// ─── DISCORD ────────────────────────────────────────────────────────────────────
	//
	const client = new DiscordService(serverHandler.getServers());
	await client.run();

})();
