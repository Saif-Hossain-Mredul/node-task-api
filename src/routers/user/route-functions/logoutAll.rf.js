const logOutAllSessions = async (req, res) => {
	const { user } = req;

	try {
		user.tokens = [];

		await user.save();

		res.status(200).send();
	} catch (err) {
		res.status(500).send();
	}
};

module.exports = logOutAllSessions;
