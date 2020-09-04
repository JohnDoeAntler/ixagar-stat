import { splitTrip } from './../../utils/db';
import { Socket, SocketConstructor } from "../context";
import { PLAYER_EVENT } from "../../chat/enum";
import { UserInfo } from "../../types/responses/types/UserInfo";
import { logger } from "../../utils/logger";
import { updateUserInfo } from "../../utils/db";
import publicIp from "public-ip";

export class Join implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on(PLAYER_EVENT.JOIN, async (user: UserInfo) => {
			const serverSig = this.options.socket.getServerSignature();

			logger.verbose(`user '${user.name}'<${user.fullTrip}> has connected to the server '${serverSig}'.`);

			const info = await updateUserInfo(user);

			if (info.tags.includes('owner')) {
				const ip = await publicIp.v4();

				const {trip1, trip2} = splitTrip(user.fullTrip);

				this.options.profileManager.updateProfile({
					...this.options.profileManager.getProfile(),
					skinUrl: `http://${ip}/image.png?trip1=${trip1}&trip2=${trip2}`,
				});

				this.options.messageManager.message(user.userId, `hi owner.`);
			}
		});
	}
}
