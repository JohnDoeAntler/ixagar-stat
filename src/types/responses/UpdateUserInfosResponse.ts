import { RESPONSE } from "../enums/op";
import { UserInfo } from "./types/UserInfo";

export interface UpdateUserInfosResponse {
	op: RESPONSE.UPDATE_USER_INFOS;
	infos: UserInfo[];
}