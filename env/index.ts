import dotenv from 'dotenv';

dotenv.config();

//
// ─── MONGOOSE ───────────────────────────────────────────────────────────────────
//
import mongoose from 'mongoose';

const MONGO_USERNAME = process.env.IX_AGAR_STAT_MONGO_DB_USERNAME || 'root';
const MONGO_PASSWORD = process.env.IX_AGAR_STAT_MONGO_DB_PASSWORD || 'example';
const MONGO_HOSTNAME = process.env.IX_AGAR_STAT_MONGO_DB_HOSTNAME || 'localhost';
const MONGO_DATABASE = process.env.IX_AGAR_STAT_MONGO_DB_DATABASE || 'test';

mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DATABASE}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

import { logger } from './../src/utils/logger';

mongoose.connection.on('open', () => logger.info('connected to mongodb.'));