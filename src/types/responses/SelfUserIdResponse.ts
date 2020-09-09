import { RESPONSE } from '../enums/op';

export interface SelfUserIdResponse {
	op: RESPONSE.SELF_USER_ID;
	userId: number;
}
