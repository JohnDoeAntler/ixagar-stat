import { findPlayerByFullTrip } from './../../utils/db';
import { Socket, SocketConstructor } from "../context";
import { RESPONSE } from "../../types/enums/op";
import { ChatMessageResponse } from "../../types/responses/ChatMessageResponse";
import { logger } from "../../utils/logger";

export class Chat implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on(RESPONSE.CHAT_MESSAGE, async (payload: ChatMessageResponse) => {
			const player = this.options.playerManager.getPlayers().get(payload.userId);

			logger.verbose(`[ ${this.options.socket.getServerSignature()} ] ${player?.name || ''}<${player?.fullTrip || ''}>: ${payload.data.text}`);

			if ((await findPlayerByFullTrip(player.fullTrip)).tags.includes('owner')) {
				if (payload.userId !== this.options.socket.getUserId()) {
					if (payload.data.text.startsWith('!')) {
						const args = payload.data.text.toLowerCase().slice(1).split(' ');
						const command = args.shift();

						if (command === 'ping') {
							this.options.messageManager.broadcast('pong');
						} else if (command === 'pm') {
							this.options.messageManager.message(payload.userId, 'private message works.');
						}
					}
				}
			}
		});
	}
}
