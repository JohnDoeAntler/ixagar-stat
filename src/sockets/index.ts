import { Interval } from './listeners/Interval';
import { ChatServerWebSocketWrapper } from "../chat";
import { MessageManager } from "../chat/managers/message";
import { PlayerManager } from "../chat/managers/player";
import { ProfileManager } from "../chat/managers/profile";
import { env } from "../utils/env";
import { SocketConstructor, Context } from "./context";
import { Chat } from "./listeners/Chat";
import { Connect } from "./listeners/Connect";
import { Join } from "./listeners/Join";
import { Leave } from "./listeners/Leave";
import { Open } from "./listeners/Open";
import { Update } from "./listeners/Update";

interface IXAgarServerHandlerProps {
	serverSig: string;
	gameServerEndpoint: string;
}

export class IXAgarServerHandler {

	//
	// ─── SERVER LIST ────────────────────────────────────────────────────────────────
	//
	private servers = new Map<string, SocketConstructor>();

	//
	// ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
	//
	constructor(private list: IXAgarServerHandlerProps[]) {}

	//
	// ─── GETTER ─────────────────────────────────────────────────────────────────────
	//
	public getServers() {
		return this.servers;
	}

	//
	// ─── EXECUTION ──────────────────────────────────────────────────────────────────
	//
	run() {
		this.list.forEach((server) => {

			//
			// ─── CHAT SERVER ─────────────────────────────────────────────────
			//
			const socket = new ChatServerWebSocketWrapper(env.IX_AGAR_STAT_CHAT_WEBSOCKET_ENDPOINT, server.serverSig);

			const playerManager = new PlayerManager(socket);
			const messageManager = new MessageManager(socket);
			const profileManager = new ProfileManager(socket);

			let ctor = {
				playerManager,
				messageManager,
				profileManager,
				socket,
				sender: socket.getSender(),
			};

			const context = new Context(ctor);

			context.execute([
				Open,
				Connect,
				// player event
				Join,
				Leave,
				Update,
				Chat,
				// service
				Interval,
			]);

			this.servers.set(server.serverSig, ctor);

		});
	}

}