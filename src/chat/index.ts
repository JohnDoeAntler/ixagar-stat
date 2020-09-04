import { EventEmitter } from "events";
import WebSocket from "ws";
import { Sender } from './sender';

export class WebSocketWrapper extends EventEmitter {
	private sender: Sender;

	constructor(endpoint: string, private serverSig: string) {
		super();

		let socket: WebSocket;

		this.sender = new Sender(
			socket = new WebSocket(endpoint, {
				origin: "http://ixagar.net",
			})
		);

		//
		// ─── WEBSOCKET LISTENERS ─────────────────────────────────────────
		//
		socket.onopen = () => {
			this.emit("open");
		};

		socket.onmessage = (e) => {
			const event = JSON.parse(e.data as string);
			this.emit(event.op, event);
		};

		socket.onclose = (e) => {
			this.emit("close", e);
		};

		socket.onerror = (e) => {
			this.emit("error", e);
		};
	}

	//
	// ─── USER ID ────────────────────────────────────────────────────────────────────
	//
	public getUserId () {
		return this.sender.getUserId();
	}

	//
	// ─── SERVER SIGNATURE ───────────────────────────────────────────────────────────
	//
	public getServerSignature () {
		return this.serverSig;
	}

	//
	// ─── SENDER ─────────────────────────────────────────────────────────────────────
	//
	public getSender() {
		return this.sender;
	}

}
