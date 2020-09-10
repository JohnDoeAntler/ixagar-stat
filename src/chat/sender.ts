import WebSocket from "ws";
import { REQUEST } from "../types/enums/op";
import { ChatMessageRequest } from "../types/requests/ChatMessageRequest";
import { NewPrivateSessionRequest } from "../types/requests/NewPrivateSessionRequest";
import { UserInfo } from "../types/requests/types/UserInfo";
import { UpdateUserInfoRequest } from "../types/requests/UpdateUserInfoRequest";

export class Sender {

	constructor(private socket: WebSocket) {}

	//
	// ─── USER ID ────────────────────────────────────────────────────────────────────
	//
	private userId: number;

	public getUserId() {
		return this.userId;
	}

	public setUserId(userId: number) {
		this.userId = userId;
	}

	//
	// ─── REQUESTS ───────────────────────────────────────────────────────────────────
	//
	public join() {
		this.send({ op: REQUEST.JOIN_TO_SERVER });
	}

	public updateUserInfo(userInfo: UserInfo) {
		this.send({
			op: REQUEST.UPDATE_USER_INFO,
			userId: this.userId,
			data: userInfo,
		} as UpdateUserInfoRequest);
	}

	public newPrivateSession (peerUserId: number) {
		this.send({
			op: REQUEST.NEW_PRIVATE_SESSION,
			userId: this.userId,
			peerUserId,
		} as NewPrivateSessionRequest);
	}

	public chatMessage(sessionId: number, content: string) {
		this.send({
			op: REQUEST.CHAT_MESSAGE,
			userId: this.userId,
			data: {
				sessionId: sessionId,
				userId: this.userId,
				text: content,
			},
		} as ChatMessageRequest);
	}

	//
	// ─── SEND ───────────────────────────────────────────────────────────────────────
	//
	private start: number = -1;

	private readonly SEND_DELAY: number = 1000;

	public async send(val: any) {
		const diff = Date.now() - this.start;

		if (diff > this.SEND_DELAY) {
			this.socket.send(JSON.stringify(val));
			this.start = Date.now();
		} else {
			await new Promise((res) =>
				setTimeout(() => {
					res();
				}, this.SEND_DELAY - diff),
			);

			this.socket.send(JSON.stringify(val));

			this.start += this.SEND_DELAY;
		}
	}

}