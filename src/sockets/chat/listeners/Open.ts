import { Socket, SocketConstructor } from "../context";

export class Open implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		this.options.socket.on('open', () => {
			this.options.sender.join();
		});
	}
}
