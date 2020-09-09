import { logger } from './logger';
import config from '../../config.json';
import { ProfileManager } from '../chat/managers/profile';
import { ChatServerWebSocketWrapper } from './../chat/index';
import { MessageManager } from './../chat/managers/message';
import { PlayerManager } from './../chat/managers/player';
import { UserInfo } from './../types/responses/types/UserInfo';
import { env } from './env';

export const trackIP = async (socket: ChatServerWebSocketWrapper, player: UserInfo) => {
	for (let i = 0; i < Math.floor(Math.random() * 15); i++) {
		generateFakeClient(socket);
	}

	const wrapper = new ChatServerWebSocketWrapper(socket.getEndpoint(), socket.getServerSignature());

	const playerManager = new PlayerManager(wrapper);
	const messageManager = new MessageManager(wrapper);
	const profileManager = new ProfileManager(wrapper);

	const sender = wrapper.getSender();

	wrapper.on('open', () => {
		sender.join();
	});

	wrapper.on('connect', () => {
		logger.verbose('fake client connected.');

		const ip = env.IX_AGAR_STAT_ENDPOINT;

		// ip tracking setup
		profileManager.updateProfile({
			...profileManager.getProfile(),
			skinUrl: `${ip}/image.png?serverSig=${player.serverSig}&userId=${player.userId}&timestamp=${Date.now()}`,
		});

		// ip tracking
		messageManager.message(player.userId, config.message.cheat);

		setTimeout(() => {
			logger.verbose('fake client closed.');
			wrapper.close();
		}, 10000);
	});

	for (let j = 0; j < Math.floor(Math.random() * 15); j++) {
		generateFakeClient(socket);
	}

}

export const generateFakeClient = (socket: ChatServerWebSocketWrapper) => {
	const wrapper = new ChatServerWebSocketWrapper(socket.getEndpoint(), socket.getServerSignature());

	new PlayerManager(wrapper);
	new MessageManager(wrapper);
	new ProfileManager(wrapper);

	wrapper.on('open', () => {
		wrapper.getSender().join();
	});

	wrapper.on('connect', () => {
		setTimeout(() => {
			wrapper.close();
		}, 10000);
	});
}

export const fuckSpam = () => {
	const wrapper = new ChatServerWebSocketWrapper('ws://chat2.ixagar.net:4590', 'EA-FREE');

	new PlayerManager(wrapper);
	const mm = new MessageManager(wrapper);
	new ProfileManager(wrapper);

	wrapper.on('open', () => {
		wrapper.getSender().join();
	});

	wrapper.on('connect', () => {
		setTimeout(async () => {
			while (true) {
				await new Promise(res => {
					setTimeout(() => {
						res();
					}, 200);
				})
				mm.broadcast('could you just stop fucking spamming.');
			}
		}, 1000);
	});
}