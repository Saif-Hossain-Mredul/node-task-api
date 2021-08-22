const updateUserById = async (req, res) => {
	const requestedUpdates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isAllowed = requestedUpdates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isAllowed)
		return res.status(400).send({ error: 'Invalid update field' });

	try {
		const user = req.user;

		requestedUpdates.forEach((update) => (user[update] = req.body[update]));

		await user.save();

		res.send(user);
	} catch (err) {
		res.status(400).send({ error: 'Bad request' });
	}
};

module.exports = updateUserById;
