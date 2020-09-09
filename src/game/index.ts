/** @format */

import { EventEmitter } from "events";
import WebSocket from "ws";
import { DataFrameWriter } from "./DataFrameWriter";
export class GameServerSocketWrapper extends EventEmitter {
	private socket: WebSocket;

	constructor(private endpoint: string) {
		super();

		this.socket = new WebSocket(endpoint, {
			origin: "http://ixagar.net",
		});

		this.socket.binaryType = "arraybuffer";

		//
		// ─── WEBSOCKET LISTENERS ─────────────────────────────────────────
		//
		this.socket.onopen = () => {
			this.emit("open");
		};

		this.socket.onmessage = (e) => {
			console.log(e);
		};

		this.socket.onclose = (e) => {
			this.emit("close", e);
		};

		this.socket.onerror = (e) => {
			this.emit("error", e);
			this.socket.close();
		};
	}

	public close() {
		return this.socket.close();
	}

	public SessionInitialize(trip: string) {
		var e = new DataFrameWriter();
		e.WriteUint8(252);
		e.WriteStringEx("lwga-110");
		e.WriteStringEx(trip);
		return e.ArrayBuffer;
	}

	public AimCursor(x: number, y: number) {
		var n = new DataFrameWriter();
		n.WriteUint8(16);
		n.WriteInt32(x);
		n.WriteInt32(y);
		return n.ArrayBuffer;
	}

	public RequestStartPlay() {
		var t = new DataFrameWriter();
		t.WriteUint8(31);
		return t.ArrayBuffer;
	}

	public RequestStartSpectate() {
		var t = new DataFrameWriter();
		t.WriteUint8(1);
		return t.ArrayBuffer;
	}

	public PlayerAction(t: number, e: number) {
		var n = new DataFrameWriter();
		n.WriteUint8(25);
		n.WriteUint8(t);
		n.WriteUint8(e);
		return n.ArrayBuffer;
	}

	public ChatMessage(message: string, e: number) {
		var n = new DataFrameWriter();
		n.WriteUint8(128);
		n.WriteUint16(e);
		n.WriteStringEx("");
		n.WriteStringEx(message);
		return n.ArrayBuffer;
	}

	public LatencyCheckRequest() {
		var t = new DataFrameWriter();
		t.WriteUint8(130);
		return t.ArrayBuffer;
	}

	public SpecifySpecTarget(t: number) {
		var e = new DataFrameWriter();
		e.WriteUint8(27);
		e.WriteInt32(t);
		return e.ArrayBuffer;
	}
}
