import { UserInfoData } from "./UserInfoData";

export interface MapUserInfoData {
	user?: UserInfoData;
	playerId: number;
	x: number;
	y: number;
	mass: number;
}