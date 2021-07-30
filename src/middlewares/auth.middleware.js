const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const secretKeys = require('../secret-keys');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decodedData = jwt.verify(token, secretKeys.TOKEN_SECRET_KEY);

		const user = await User.findOne({
			'_id': decodedData._id,
			'tokens.token': token,
		});

		if (!user) throw new Error();

		req.user = user;
		req.token = token;

		next();
	} catch (err) {
		res.status(401).send({ error: 'Unable to authenticate' });
	}
};

module.exports = auth;
