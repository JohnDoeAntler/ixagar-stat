import { RESPONSE } from '../enums/op';
import { Session } from './types/FixedGroupSession';

export interface UpdatePrivateSessionResponse {
	op: RESPONSE.UPDATE_PRIVATE_SESSION;
	info: Session;
}
