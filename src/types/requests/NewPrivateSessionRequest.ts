import { REQUEST } from "../enums/op";

export interface NewPrivateSessionRequest {
	op: REQUEST.NEW_PRIVATE_SESSION;
	userId: number;
	peerUserId: number;
}