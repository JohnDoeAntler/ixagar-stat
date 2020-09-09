import { model, Document, Schema } from "mongoose";

interface Player extends Document{
	trip1: string[];
	trip2: string[];
	aliases: string[];
	skinUrls: string[];
	tags: string[];
	lastActive: Date;
}

const PlayerSchema = new Schema({
	trip1: {
		type: [String],
		required: true,
		unique: true,
	},
	trip2: {
		type: [String],
		required: true,
		unique: true,
	},
	aliases: {
		type: [String],
		required: true,
		unique: false,
	},
	skinUrls: {
		type: [String],
		required: true,
		unique: false,
	},
	tags: {
		type: [String],
		required: true,
		unique: false,
		default: [],
	},
	ips: {
		type: [String],
		required: true,
		unique: false,
		default: [],
	},
	lastActive: {
		type: Date,
		required: true,
		unique: false,
		default: Date.now(),
	},
});

export const PlayerModel = model<Player>("Player", PlayerSchema);