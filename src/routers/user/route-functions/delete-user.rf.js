const deleteUser = async (req, res) => {
	try {
		// we can also use:
		// await req.user.delete()

		await req.user.remove();

		res.send(req.user);
	} catch (err) {
		res.status(400).send({ error: 'Bad request' });
	}
};

module.exports = deleteUser;
