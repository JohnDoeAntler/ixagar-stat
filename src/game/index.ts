/** @format */

import { EventEmitter } from "events";
import WebSocket from "ws";
import { DataFrameWriter } from "./DataFrameWriter";
import { json } from "express";

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
			this.emit("message", e);
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

	public sendSessionInitialize(trip: string) {
		var e = new DataFrameWriter();
		e.WriteUint8(252);
		e.WriteStringEx("lwga-110");
		e.WriteStringEx(trip);
		return this.socket.send(e.ArrayBuffer);
	}

	public sendAimCursor(x: number, y: number) {
		var n = new DataFrameWriter();
		n.WriteUint8(16);
		n.WriteInt32(x);
		n.WriteInt32(y);
		return this.socket.send(n.ArrayBuffer);
	}

	public sendUserEntryInfo(name: string, team: string, skinUrl1: string, trip: string, skinUrl2: string) {
		var s = new DataFrameWriter();
		s.WriteUint8(30)
		s.WriteStringEx(name)
		s.WriteStringEx(team)
		s.WriteStringEx(skinUrl1)
		s.WriteStringEx(trip)
		s.WriteStringEx(skinUrl2)
		return this.socket.send(s.ArrayBuffer);
	}

	public sendRequestStartPlay() {
		var t = new DataFrameWriter();
		t.WriteUint8(31);
		return this.socket.send(t.ArrayBuffer);
	}

	public sendRequestStartSpectate() {
		var t = new DataFrameWriter();
		t.WriteUint8(1);
		return this.socket.send(t.ArrayBuffer);
	}

	public sendPlayerAction(t: number, e: number) {
		var n = new DataFrameWriter();
		n.WriteUint8(25);
		n.WriteUint8(t);
		n.WriteUint8(e);
		return this.socket.send(n.ArrayBuffer);
	}

	public sendChatMessage(message: string, e: number) {
		var n = new DataFrameWriter();
		n.WriteUint8(128);
		n.WriteUint16(e);
		n.WriteStringEx("");
		n.WriteStringEx(message);
		return this.socket.send(n.ArrayBuffer);
	}

	public sendLatencyCheckRequest() {
		var t = new DataFrameWriter();
		t.WriteUint8(130);
		return this.socket.send(t.ArrayBuffer);
	}

	public sendSpecifySpecTarget(t: number) {
		var e = new DataFrameWriter();
		e.WriteUint8(27);
		e.WriteInt32(t);
		return this.socket.send(e.ArrayBuffer);
	}
}
