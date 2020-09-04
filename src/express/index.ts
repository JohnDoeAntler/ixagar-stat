import express from 'express';
import { router } from '../routes';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

class Express {

	private server: express.Express;

	constructor() {
		this.server = express();
		this.server.use(router());
	}

	async run() {
		const port = env.PORT || 80;

		await new Promise((res) => this.server.listen(port, res));

		logger.info(`server is start and running on port '${port}'.`);
	}

}

export const server = new Express();
