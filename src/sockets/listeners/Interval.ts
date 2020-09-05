import { getName } from 'country-list';
import { trackIP } from '../../utils/ip';
import { Socket, SocketConstructor } from "../context";
import { findPlayerByFullTrip } from './../../utils/db';

export class Interval implements Socket {
	constructor(private options: SocketConstructor) {}

	async run() {
		setInterval(async () => {
			const players = Array.from(this.options.playerManager.getPlayers().values());

			players.filter(async (player) => {
				const info = await findPlayerByFullTrip(player.fullTrip);

				if (info && info.tags.includes('cheater')) {
					if (this.options.playerManager.getCheaters().has(player.userId)) {
						// get geo object
						const geo = this.options.playerManager.getCheaters().get(player.userId);

						// broadcast
						if (geo) {
							this.options.messageManager.broadcast(`cheater '${player.name}'(${player.fullTrip}) who from ${getName(geo.country)}, ${geo.city} is currently in-game.`);
						} else {
							this.options.messageManager.broadcast(`cheater '${player.name}'(${player.fullTrip}) is currently in-game.`);
						}
					} else {
						// track ip
						await trackIP(this.options.socket, player);

						// broadcast
						this.options.messageManager.broadcast(`cheater '${player.name}'(${player.fullTrip}) is currently in-game.`);
					}
				}
			});
		}, 60000);
	}
}
