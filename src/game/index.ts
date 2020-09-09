import { EventEmitter } from 'events';
import WebSocket from 'ws';
export class GameServerSocketWrapper extends EventEmitter {

	private socket: WebSocket;

	constructor(private endpoint: string) {
		super();

		this.socket = new WebSocket(endpoint, {
			origin: "http://ixagar.net",
		});

		this.socket.binaryType = 'arraybuffer';

		//
		// ─── WEBSOCKET LISTENERS ─────────────────────────────────────────
		//
		this.socket.onopen = () => {
			this.emit("open");
		};

		this.socket.onmessage = (e) => {
			console.log('game websocket');
			console.log(e);
		};

		this.socket.onclose = (e) => {
			this.emit("close", e);
		};

		this.socket.onerror = (e) => {
			this.emit("error", e);
		};
	}

}