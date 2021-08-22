const User = require('../../../models/user.model');

const loginUser = async (req, res) => {
	try {
		const user = await User.findByCredentials({ ...req.body });
		const token = await user.generateAuthToken();

		res.status(200).send({ user, token });
	} catch (err) {
		res.status(400).send();
	}
};

module.exports = loginUser;
