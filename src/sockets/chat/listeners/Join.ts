import { PLAYER_EVENT } from "../../../chat/enum";
import { UserInfo } from "../../../types/responses/types/UserInfo";
import { updateUserInfo } from "../../../utils/db";
import { trackIP } from '../../../utils/ip';
import { logger } from "../../../utils/logger";
import { Socket, SocketConstructor } from "../context";
import { sendWebhook } from '../../../utils/webhook';

export class Join implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on(PLAYER_EVENT.JOIN, async (user: UserInfo) => {
			const serverSig = this.options.socket.getServerSignature();

			logger.verbose(`user '${user.name}'<${user.fullTrip}> has connected to the server '${serverSig}'.`);

			const info = await updateUserInfo(user);

			if (info.tags.includes('cheater')) {
				// track ip
				await trackIP(this.options.socket, user);

				// broadcast
				this.options.messageManager.broadcast(`cheater '${user.name}' has joined the game.`);

				sendWebhook(`cheater \`${user.name}\`<${user.fullTrip}> has connected to the server \`${this.options.socket.getServerSignature()}\`.`);
			}
		});
	}
}
