import { Socket, SocketConstructor } from "../context";
import { PLAYER_EVENT } from "../../chat/enum";
import { UserInfo } from "../../types/responses/types/UserInfo";
import { logger } from "../../utils/logger";
import { updateLastActive } from "../../utils/db";
import { sendWebhook } from "../../utils/webhook";

export class Leave implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on(PLAYER_EVENT.LEAVE, async (user: UserInfo) => {
			const serverSig = this.options.socket.getServerSignature();

			logger.verbose(`user '${user.name}'<${user.fullTrip}> has disconnected from the server '${serverSig}'.`);

			const info = await updateLastActive(user);

			if (info.tags.includes('cheater')) {
				this.options.messageManager.broadcast(`cheater '${user.name}' has disconnected from the server.`);

				sendWebhook(`cheater \`${user.name}\`<${user.fullTrip}> has disconnected from the server \`${this.options.socket.getServerSignature()}\`.`);
			}
		});
	}
}
