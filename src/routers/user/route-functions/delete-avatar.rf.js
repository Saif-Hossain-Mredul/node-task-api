const deleteAvatar = async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();

		res.send();
	} catch (err) {
		res.status(400).send();
	}
};

module.exports = deleteAvatar;
