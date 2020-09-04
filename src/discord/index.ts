import { PlayerModel } from './../models/player';
import { SocketConstructor } from './../sockets/context';
import { Client, MessageEmbed } from 'discord.js';
import { logger } from '../utils/logger';
import { env } from '../utils/env';
import fs from 'fs';
import path from 'path';

export class DiscordService {

	private client: Client;

	constructor(private servers: Map<string, SocketConstructor>) {
		this.client = new Client();
	}

	async run() {
		this.client.on('ready', () => {
			logger.info(`logged in as '${this.client.user.tag}'`);
		});

		this.client.on('message', async (message) => {
			if (
				message.author.id !== env.IX_AGAR_STAT_DISCORD_OWNER_ID
				&& !message.member.roles.cache.some(role => role.name === 'MODERATOR')
			) return;

			if (message.content.startsWith('!')) {
				const args = message.content.slice(1).split(' ');
				const command = args.shift();

				switch (command) {
					case 'find':

						if (['id', 'name', 'skin', 'trip1', 'trip2'].includes(args[0])) {
							const field = args[0] === 'id' ? '_id' : args[0] === 'name' ? 'aliases' : args[0] === 'skin' ? 'skinUrls' : args[0];

							const arr = await PlayerModel.find({[field]: field === '_id' ? args[1] : new RegExp(args.slice(1).join(' '))}).lean();

							if (arr.length === 0) {
								message.channel.send('no record was found.');
							} else if (arr.length > 5) {
								message.channel.send('too many results.');
							} else if (arr.length == 1) {
								const info = arr[0];

								const embed = new MessageEmbed()
									.setColor('#0099ff')
									.setTitle('User query')
									.setDescription(`this user has total ${info.aliases.length} aliases, ${info.skinUrls.length} skins, ${info.trip1.length} IP Addresses and ${info.trip2.length} devices.`)
									.addField('id', info._id)
									.addField('aliases', info.aliases.map((e, i) => `${i+1}. ${e}`).join('\n'))
									.addField('skins', info.skinUrls.slice(10).map((e, i) => `${i+1}. ${e.slice(0,40)}`).join('\n'))
									.addField('trips of IP Addresses', info.trip1.map((e, i) => `${i+1}. ${e}`).join('\n'))
									.addField('trips of cookies', info.trip2.map((e, i) => `${i+1}. ${e}`).join('\n'))
									.addField('is cheating', info.tags.includes('cheater'))
									.setTimestamp()

								message.channel.send(embed);
							} else {
								const embed = new MessageEmbed()
									.setColor('#0099ff')
									.setTitle('User query')
									.setDescription(`about ${arr.length} results.\n${
										arr.map((info, i) => `${i+1}. ${info.aliases.join(', ').slice(0, 20)}<${info.trip1.join(', ')}#${info.trip2.join(', ')}>`).join('\n')
									}`)
									.setTimestamp()

								message.channel.send(embed);
							}

						} else {
							message.channel.send('argument 0 is not valid, try `name`, `skin`, `trip1` or `trip2`.');
						}

						break;

					case 'players':
						if (this.servers.has(args[0])) {
							const players = Array.from(this.servers.get(args[0]).playerManager.getPlayers().values());

							const embed = new MessageEmbed()
								.setColor('#0099ff')
								.setTitle('Server info')
								.setDescription(`${players.length} player(s) online.\n${
									players.map((player, i) => `${i+1}. ${player.team}${player.name} <${player.fullTrip}>`).join('\n')
								}`)
								.setTimestamp()
							
							message.channel.send(embed);

						} else {
							message.channel.send(`invalid channel signature. try ${Array.from(this.servers.keys()).map(x => `\`${x}\``).join(', ')}.`);
						}

						break;
					
					case 'cheaters':

						const cheaters = await PlayerModel.find({tags: 'cheater'}).lean();

						const embed = new MessageEmbed()
							.setColor('#0099ff')
							.setTitle('Cheater query')
							.setDescription(`${cheaters.length} cheaters were found in total.\n${
								cheaters.map((info, i) => `${i+1}. ${info.aliases.join(', ').slice(0, 20)}<${info._id}>`).join('\n')
							}`)
							.setTimestamp()

						message.channel.send(embed);

						break;

					case 'cheat':

						try {
							const target = await PlayerModel.findById(args[0]).lean();

							const status = await PlayerModel.findByIdAndUpdate(args[0], {
								[target.tags.includes('cheater') ? '$pull' : '$addToSet']: {
									tags: 'cheater'
								},
							});

							message.channel.send(`user '${status.aliases[0]}'<${args[0]}> has been ${target ? 'un' : ''}tagged as cheater.`);
						} catch (e) {
							message.channel.send('no user was found.');
						}

						break;
				
					default:
						message.channel.send('invalid command.');
						break;
				}
			}
		});

		await this.client.login(env.IX_AGAR_STAT_DISCORD_TOKEN);
	}

}
