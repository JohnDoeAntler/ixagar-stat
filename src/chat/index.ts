import { EventEmitter } from "events";
import WebSocket from "ws";
import { Sender } from './sender';

export class WebSocketWrapper extends EventEmitter {

	private socket: WebSocket;

	private sender: Sender;

	constructor(private endpoint: string, private serverSig: string) {
		super();

		this.sender = new Sender(
			this.socket = new WebSocket(endpoint, {
				origin: "http://ixagar.net",
			})
		);

		//
		// ─── WEBSOCKET LISTENERS ─────────────────────────────────────────
		//
		this.socket.onopen = () => {
			this.emit("open");
		};

		this.socket.onmessage = (e) => {
			const event = JSON.parse(e.data as string);
			this.emit(event.op, event);
		};

		this.socket.onclose = (e) => {
			this.emit("close", e);
		};

		this.socket.onerror = (e) => {
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
	// ─── ENDPOINT ───────────────────────────────────────────────────────────────────
	//
	public getEndpoint () { 
		return this.endpoint;
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

	public close() {
		return this.socket.close();
	}

}
