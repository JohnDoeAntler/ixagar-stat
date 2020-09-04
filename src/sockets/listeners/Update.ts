import { Socket, SocketConstructor } from "../context";
import { PLAYER_EVENT } from "../../chat/enum";
import { UserInfo } from "../../types/responses/types/UserInfo";
import { logger } from "../../utils/logger";
import { updateUserInfo } from "../../utils/db";

export class Update implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on(PLAYER_EVENT.UPDATE, async (old: UserInfo, current: UserInfo) => {
			logger.verbose(`user '${old.name}'<${old.fullTrip}> changed its name to '${current.name}'.`);

			const info = await updateUserInfo(current);

			if (info.tags.includes('cheater')) {
				if (old.name !== current.name) {
					this.options.messageManager.broadcast(`cheater '${old.name}'(${old.fullTrip}) has changed its name to '${current.name}'.`);
				} else if (old.skinUrl !== current.skinUrl) {
					this.options.messageManager.broadcast(`cheater '${old.name}'(${old.fullTrip}) has changed its skin.`);
				}
			}
		});
	}
}
