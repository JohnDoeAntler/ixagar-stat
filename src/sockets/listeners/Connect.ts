import { Socket, SocketConstructor } from "../context";
import { UserInfo } from "../../types/responses/types/UserInfo";
import { logger } from "../../utils/logger";

export class Connect implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on('connect', async (user: UserInfo) => {
			logger.info(`connected to '${this.options.socket.getServerSignature()}'.`);
		});
	}
}
