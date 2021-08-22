const User = require('../../../models/user.model');

const createUser = async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
};

module.exports = createUser;
