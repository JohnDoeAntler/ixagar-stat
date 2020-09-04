import { env } from './../../utils/env';
import config from '../../../config.json';
import { RESPONSE } from '../../types/enums/op';
import { UserInfo } from '../../types/requests/types/UserInfo';
import { SelfUserIdResponse } from '../../types/responses/SelfUserIdResponse';
import { WebSocketWrapper } from './../index';

export class ProfileManager {

	//
	// ─── PROFILE ────────────────────────────────────────────────────────────────────
	//
	private profile: UserInfo;
	
	constructor(
		private emitter: WebSocketWrapper,
	) {
		//
		// ─── CUSTOMER LISTENERS ──────────────────────────────────────────
		//
		this.emitter.on(RESPONSE.SELF_USER_ID, (payload: SelfUserIdResponse) => {
			this.emitter.getSender().setUserId(payload.userId);

			this.emitter.getSender().updateUserInfo(this.profile = {
				siteSig: "ix",
				serverSig: emitter.getServerSignature(),
				name: config.profile.name,
				team: "",
				code: "",
				skinUrl: `${env.IX_AGAR_STAT_ENDPOINT}/image.png`,
				envSig: "",
				profileComment: config.profile.description,
				showTripKey: false,
			});
		});
	}

	//
	// ─── GETTER ─────────────────────────────────────────────────────────────────────
	//
	public getProfile() {
		return this.profile;
	}

	//
	// ─── SETTER/SENDER ──────────────────────────────────────────────────────────────
	//
	public updateProfile(profile: UserInfo) {
		this.emitter.getSender().updateUserInfo(this.profile = profile);
	}

}