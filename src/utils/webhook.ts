/** @format */

import axios from "axios";
import { env } from "./env";

export const sendWebhook = async (content: string) => {
	await axios.post(env.IX_AGAR_EVENT_WEBHOOK, {
		embeds: [
			{
				title: "cheater event",
				description: content,
				color: 65535,
				timestamp: new Date().toISOString()
			},
		],
	});
};
