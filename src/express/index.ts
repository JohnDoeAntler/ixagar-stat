import { ChatServerHandler } from './../sockets/index';
import express from 'express';
import { router } from '../routes';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

export class ExpressService {

	private server: express.Express;

	constructor(private serverHandler: ChatServerHandler) {
		this.server = express();
		this.server.use(router(serverHandler));
	}

	async run() {
		const port = env.PORT || 80;

		await new Promise((res) => this.server.listen(port, res));

		logger.info(`server is start and running on port '${port}'.`);
	}

}
