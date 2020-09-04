import { findPlayerByFullTrip } from './../../utils/db';
import { Socket, SocketConstructor } from "../context";
import { getName } from 'country-list';
import { env } from '../../utils/env';
import config from '../../../config.json';

export class Interval implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		setInterval(async () => {
			const players = Array.from(this.options.playerManager.getPlayers().values());

			players.filter(async (player) => {
				const info = await findPlayerByFullTrip(player.fullTrip);

				if (info.tags.includes('cheater')) {
					if (this.options.playerManager.getCheaters().has(player.userId)) {
						// get geo object
						const geo = this.options.playerManager.getCheaters().get(player.userId);

						// broadcast
						if (geo) {
							this.options.messageManager.broadcast(`dear all, cheater '${player.name}'(${player.fullTrip}) who from ${getName(geo.country)}, ${geo.city} is currently in-game.`);
						} else {
							this.options.messageManager.broadcast(`dear all, cheater '${player.name}'(${player.fullTrip}) is currently in-game.`);
						}
					} else {
						const ip = env.IX_AGAR_STAT_ENDPOINT;

						// ip tracking setup
						this.options.profileManager.updateProfile({
							...this.options.profileManager.getProfile(),
							skinUrl: `${ip}/image.png?serverSig=${player.serverSig}&userId=${player.userId}`,
						});

						// ip tracking
						this.options.messageManager.message(player.userId, config.message.cheat);
					}
				}
			});
		}, 60000);
	}
}
