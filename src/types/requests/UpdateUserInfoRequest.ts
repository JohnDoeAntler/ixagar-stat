import { REQUEST } from './../enums/op';
import { UserInfo } from './types/UserInfo';
export interface UpdateUserInfoRequest {
	op: REQUEST.UPDATE_USER_INFO;
	userId: number;
	data: UserInfo,
}