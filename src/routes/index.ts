import { ChatServerHandler } from './../sockets/index';
import { Router as createRouter } from 'express';
import { db } from './../controllers/db';
import { fakeImage } from './../controllers/fake';

export const router = (serverHandler: ChatServerHandler) => createRouter()
	.get('/db', db)
	.get('/image.png', fakeImage(serverHandler))