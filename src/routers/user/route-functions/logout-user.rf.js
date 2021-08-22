const logOut = async (req, res) => {
	const { user, token } = req;

	try {
		user.tokens = user.tokens.filter(
			(userToken) => userToken.token !== token
		);

		await user.save();

		res.status(200).send();
	} catch (err) {
		res.status(500).send();
	}
};

module.exports = logOut;
