/** @format */

import { PlayerModel } from "../models/player";
import { UserInfo } from "../types/responses/types/UserInfo";

const update = async (id: any, user: UserInfo) => {
	const { trip1, trip2 } = splitTrip(user.fullTrip);

	return await PlayerModel.findByIdAndUpdate(
		id,
		{
			$addToSet: {
				aliases: user.name.trim(),
				skinUrls: user.skinUrl,
				trip1,
				trip2,
			},
		},
		{ new: true },
	);
};

const create = async (user: UserInfo) => {
	const { trip1, trip2 } = splitTrip(user.fullTrip);

	return await new PlayerModel({
		trip1,
		trip2,
		aliases: user.name.trim(),
		skinUrls: user.skinUrl,
		tags: [],
	}).save();
};

export const splitTrip = (fullTrip: string) => {
	const [trip1, trip2] = fullTrip.split("#");
	return {
		trip1,
		trip2,
	};
};

export const findPlayerByFullTrip = async (fullTrip: string) => {
	const { trip1, trip2 } = splitTrip(fullTrip);

	return await PlayerModel.findOne({
		$or: [{ trip1 }, { trip2 }],
	}).lean();
};

export const updateUserInfo = async (user: UserInfo) => {
	const entity = await findPlayerByFullTrip(user.fullTrip);
	return entity ? await update(entity._id, user) : await create(user);
};

export const updateLastActive = async (user: UserInfo) => {
	let entity = await findPlayerByFullTrip(user.fullTrip);

	if (entity) {
		entity = await PlayerModel.findByIdAndUpdate(
			entity._id,
			{
				lastActive: new Date(),
			},
			{ new: true },
		);
	} else {
		entity = await create(user);
	}

	return entity;
};
