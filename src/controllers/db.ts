import { Request, Response } from "express";
import { PlayerModel } from '../models/player';

export const db = async (req: Request, res: Response) => {
	res.json(await PlayerModel.find());
};
