db = db.getSiblingDB('ixagar');

db.createUser({
	user: 'root',
	pwd: 'example',
	roles: [
		{
			role: 'dbOwner',
			db: 'ixagar'
		}
	]
});