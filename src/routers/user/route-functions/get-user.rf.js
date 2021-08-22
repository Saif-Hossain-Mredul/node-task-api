const getUser = async (req, res) => {
	try {
		res.send(req.user);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
};

module.exports = getUser;
