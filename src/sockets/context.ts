import { ChatServerWebSocketWrapper } from '../chat';
import { Sender } from '../chat/sender';
import { MessageManager } from './../chat/managers/message';
import { PlayerManager } from './../chat/managers/player';
import { ProfileManager } from './../chat/managers/profile';

export interface Socket {
	run(): Promise<void>;
}

export interface SocketConstructor {
	socket: ChatServerWebSocketWrapper;
	sender: Sender;
	playerManager: PlayerManager;
	messageManager: MessageManager;
	profileManager: ProfileManager;
}

export class Context {

	constructor(private options: SocketConstructor) { }

	public execute(listeners: (new (options: SocketConstructor) => Socket)[]) {
		listeners.forEach(l => {
			new l(this.options).run();
		});
	}

}
