import { env } from './env';
import winston from "winston";
import path from "path";

const format = winston.format.combine(
	winston.format.timestamp({ format: "DD/MM/YYYY - HH:mm:ss.SSS" }),
	winston.format.printf(({ level, timestamp, message }) => `${timestamp} [ ${level.toUpperCase()} ]: ${message}`),
);

export const logger = winston.createLogger({
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, "../../log/error.log"),
			level: "error",
			format,
		}),
		new winston.transports.File({
			filename: path.join(__dirname, "../../log/info.log"),
			level: "info",
			format,
		}),
	],
});

if (env.NODE_ENV !== "production") {
	// to console
	logger.add(
		new winston.transports.Console({
			level: env.LOG_LEVEL,
			format,
		}),
	);
}