import { RESPONSE } from '../enums/op';
import { Session } from "./types/FixedGroupSession";

export interface UpdateFixedGroupSessionsResponse {
	op: RESPONSE.UPDATE_FIXED_GROUP_SESSIONS;
	infos: Session[];
}
