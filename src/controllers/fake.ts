import { ChatServerHandler } from './../sockets/index';
import { Request, Response } from "express";
import geoip from 'geoip-lite';
import { logger } from "../utils/logger";
import { getName } from 'country-list';
import path from 'path';

export const fakeImage = (serverHandler: ChatServerHandler) => (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, '../../data/fake.png'));

	//
	// ─── USER ID ────────────────────────────────────────────────────────────────────
	//
	const { serverSig, userId, timestamp } = req.query;

	//
	// ─── IP TRACKING ────────────────────────────────────────────────────────────────
	//
	const fwd = req.headers['x-forwarded-for'] as string;

	let ip: string;

	if (fwd) {
		const list = fwd.split(',');
		ip = list.pop();
	} else {
		ip = req.connection.remoteAddress.split(":").pop()
	}

	const geo = geoip.lookup(ip);

	//
	// ─── LOGGING ────────────────────────────────────────────────────────────────────
	//
	logger.verbose(`IP address: ${ip}${geo && `, country: ${geo.country}, region: ${geo.region}, city: ${geo.city}` || ''}.`);

	if (!serverSig || !userId || !timestamp || Date.now() - parseInt(timestamp as string) > 1500) return;

	logger.info(`userId: ${userId}, serverSig: ${serverSig}, timestamp: ${timestamp}`);

	const server = serverHandler.getServers().get(serverSig as string);
	const cheater = server.playerManager.getPlayers().get(parseInt(userId as string));

	if (
		!server.playerManager.getCheaters().has(parseInt(userId as string))
		&& !cheater
	) {
		// broadcast
		server.messageManager.broadcast(`cheater '${cheater.name}'(${cheater.fullTrip}) is from ${getName(geo.country)}, ${geo.city}.`);
		// add geo
		server.playerManager.getCheaters().set(parseInt(userId as string), geo);
	}

};
