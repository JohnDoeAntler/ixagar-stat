import { Request, Response } from "express";
import geoip from 'geoip-lite';
import { logger } from "../utils/logger";

export const fakeImage = (req: Request, res: Response) => {
	res.sendStatus(500);

	//
	// ─── USER ID ────────────────────────────────────────────────────────────────────
	//
	const userId = req.params.id;

	//
	// ─── IP TRACKING ────────────────────────────────────────────────────────────────
	//
	const ip = req.connection.remoteAddress.split(":").pop();
	const geo = geoip.lookup(ip);

	//
	// ─── LOGGING ────────────────────────────────────────────────────────────────────
	//
	logger.verbose(`userId: ${userId}, IP address: ${ip}${geo && `, country: ${geo.country}, region: ${geo.region}, city: ${geo.city}` || ''}.`);
};
