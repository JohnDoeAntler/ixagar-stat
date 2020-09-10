import { MessageEvent } from 'ws';
import { MapUserInfoData } from '../../types/game/MapUserInfoData';
import { UserInfoData } from '../../types/game/UserInfoData';
import { DataFrameReader } from '../DataFrameReader';
import { GameServerSocketWrapper } from './../index';

export class UserInfoDataManager {

	private users = new Map<number, UserInfoData>();

	private map = new Map<number, MapUserInfoData>();

	constructor(socket: GameServerSocketWrapper) {
		socket.on('message', (e: MessageEvent) => {
			const test = e.data;

			var i = new DataFrameReader(test);

			switch (i.ReadUint8()) {
				case 42: 
					const count = i.ReadUint16();
					for (let f = 0; f < count; f++) {
						// num
						const num = i.ReadUint16();

						// model
						const user = {
							num,
							name: i.ReadStringEx(),
							team: i.ReadStringEx(),
							skinUrl1: i.ReadStringEx(),
							isBot: i.ReadUint8() > 0,
							teamId: i.ReadUint16(),
							trip: i.ReadStringEx(),
							skinUrl2: i.ReadStringEx(),
						};

						// event
						if (this.users.has(num)) {
							socket.emit('change', this.users.get(num), user);
						} else {
							socket.emit('join', user);
						}

						// map user by num
						this.users.set(num, user);
					}
					break;
				case 45:
					for (let f = 0; f < i.ReadUint16(); f++) {
						const num = i.ReadUint16();

						// event
						if (this.users.has(num)) {
							socket.emit('leave', this.users.has(num));

							// update map
							this.users.delete(num);
						}
					}
					break;
				case 41:
					this.map.clear();

					for (let f = 0; f < i.ReadUint16(); f++) {

						const playerId = i.ReadUint16();
						const x = i.ReadInt16();
						const y = i.ReadInt16();
						const mass = i.ReadUint16();

						this.map.set(playerId, {
							user: this.users.get(playerId),
							x,
							y,
							mass,
						});
					}
					break;
			}
		});
	}

	//
	// ─── GETTER ─────────────────────────────────────────────────────────────────────
	//
	public getUsers() {
		return this.users;
	}

	public getMap() {
		return this.map;
	}

}