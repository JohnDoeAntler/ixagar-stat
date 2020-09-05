import { sendWebhook } from './../../utils/webhook';
import config from '../../../config.json';
import { PLAYER_EVENT } from "../../chat/enum";
import { UserInfo } from "../../types/responses/types/UserInfo";
import { updateUserInfo } from "../../utils/db";
import { env } from '../../utils/env';
import { logger } from "../../utils/logger";
import { Socket, SocketConstructor } from "../context";

export class Join implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on(PLAYER_EVENT.JOIN, async (user: UserInfo) => {
			const serverSig = this.options.socket.getServerSignature();

			logger.verbose(`user '${user.name}'<${user.fullTrip}> has connected to the server '${serverSig}'.`);

			const info = await updateUserInfo(user);

			if (info.tags.includes('cheater')) {
				const ip = env.IX_AGAR_STAT_ENDPOINT;

				// ip tracking setup
				this.options.profileManager.updateProfile({
					...this.options.profileManager.getProfile(),
					skinUrl: `${ip}/image.png?serverSig=${user.serverSig}&userId=${user.userId}`,
				});

				// ip tracking
				this.options.messageManager.message(user.userId, config.message.cheat);

				// broadcast
				this.options.messageManager.broadcast(`cheater '${user.name}'(${user.fullTrip}) has joined the game.`);

				sendWebhook(`cheater \`${user.name}\`<${user.fullTrip}> has connected to the server \`${this.options.socket.getServerSignature()}\`.`);
			}
		});
	}
}
