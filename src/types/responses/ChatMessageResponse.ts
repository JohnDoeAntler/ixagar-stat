import { RESPONSE } from '../enums/op';
import { ChatMessageData } from "./types/ChatMessageData";

export interface ChatMessageResponse {
	op: RESPONSE.CHAT_MESSAGE;
	userId: number;
	data: ChatMessageData;
}