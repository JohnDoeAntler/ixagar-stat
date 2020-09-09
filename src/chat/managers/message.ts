import { ChatServerWebSocketWrapper } from '..';
import { RESPONSE } from '../../types/enums/op';
import { UpdatePrivateSessionResponse } from '../../types/responses/UpdatePrivateSessionResponse';
import { UpdateUserInfosResponse } from '../../types/responses/UpdateUserInfosResponse';
import { UpdateFixedGroupSessionsResponse } from '../../types/responses/UpdateFixedGroupSessionsResponse';
import { Session } from '../../types/responses/types/FixedGroupSession';

export class MessageManager {

	//
	// ─── PRIVATE SESSIONS ───────────────────────────────────────────────────────────
	//
	private privateSessions = new Map<number, number>();

	private fixedGroupSessions: Session[] = [];

	//
	// ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
	//		
	constructor(
		private emitter: ChatServerWebSocketWrapper,
	) {
		this.emitter.on(RESPONSE.UPDATE_USER_INFOS, (payload: UpdateUserInfosResponse) => {
			if (payload.infos.length === 1) {
				this.privateSessions.delete(payload.infos[0].userId)
			}
		});

		this.emitter.on(RESPONSE.UPDATE_FIXED_GROUP_SESSIONS, (payload: UpdateFixedGroupSessionsResponse) => {
			this.fixedGroupSessions = payload.infos;
		});
	}

	//
	// ─── GETTER ─────────────────────────────────────────────────────────────────────
	//
	public getPrivateSessions() {
		return this.privateSessions;
	}

	public getFixedGroupSessions() {
		return this.fixedGroupSessions;
	}

	public message(userId: number, content: string) {
		const sender = this.emitter.getSender();

		// already created private sessions
		if (this.privateSessions.has(userId)) {
			// send directly
			sender.chatMessage(this.privateSessions.get(userId), content);
		} else { // no private sessions was found
			// create new private session
			sender.newPrivateSession(userId);

			// on new private sessions created
			this.emitter.once(RESPONSE.UPDATE_PRIVATE_SESSION, (res: UpdatePrivateSessionResponse) => {
				// update instance variables 
				this.privateSessions.set(userId, res.info.sessionId);

				// send message
				sender.chatMessage(res.info.sessionId, content);
			});
		}
	}

	public broadcast(content: string) {
		this.fixedGroupSessions.forEach((session) => {
			this.emitter.getSender().chatMessage(session.sessionId, content);
		});
	}

}