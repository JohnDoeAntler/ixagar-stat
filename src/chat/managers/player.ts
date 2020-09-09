import { Lookup } from 'geoip-lite';
import { RESPONSE } from "../../types/enums/op";
import { UserInfo } from '../../types/responses/types/UserInfo';
import { UpdateUserInfosResponse } from "../../types/responses/UpdateUserInfosResponse";
import { PLAYER_EVENT } from "../enum";
import { ChatServerWebSocketWrapper } from './../index';

export class PlayerManager {

	//
	// ─── PLAYERS ────────────────────────────────────────────────────────────────────
	//
	private players = new Map<number, UserInfo>();

	private cheaters = new Map<number, Lookup>();

	constructor(
		private emitter: ChatServerWebSocketWrapper,
	) {
		this.emitter.on(RESPONSE.UPDATE_USER_INFOS, (payload: UpdateUserInfosResponse) => {
			const sender = this.emitter.getSender();

			if (payload.infos.length === 1) {
				// single request
				const info = payload.infos[0];

				if (info.isAlive) {
					// in-game

					if (this.players.has(info.userId)) {
						// join
						if (sender.getUserId() !== info.userId && info.isAlive) {
							this.emitter.emit(PLAYER_EVENT.UPDATE, this.players.get(info.userId), info);
						}

					} else {
						// update
						if (sender.getUserId() !== info.userId) {
							this.emitter.emit(PLAYER_EVENT.JOIN, info);
						} else {
							this.emitter.emit("connect");
						}

					}
				} else {
					// disconnected
					this.players.delete(info.userId);
					this.emitter.emit(PLAYER_EVENT.LEAVE, info);
				}
			}

			// add and modify
			payload.infos.filter(x => x.isAlive).forEach((info) => {
				this.players.set(info.userId, info);
			});
		});
	}

	//
	// ─── GETTER ─────────────────────────────────────────────────────────────────────
	//
	public getPlayers() {
		return this.players;
	}

	public getCheaters() {
		return this.cheaters;
	}

}