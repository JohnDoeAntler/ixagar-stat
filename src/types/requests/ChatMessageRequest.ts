import { REQUEST } from "../enums/op";
import { ChatMessageData } from "./types/ChatMessageData";

export interface ChatMessageRequest {
	op: REQUEST.CHAT_MESSAGE,
	userId: number;
	data: ChatMessageData;
}