const express = require('express');
const multer = require('multer');

const User = require('../models/user.model');
const auth = require('../middlewares/auth.middleware');

const userRouter = new express.Router();

// Create user
userRouter.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

// Login user
userRouter.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials({ ...req.body });
		const token = await user.generateAuthToken();

		res.status(200).send({ user, token });
	} catch (err) {
		res.status(400).send();
	}
});

// Logging out user
userRouter.post('/users/logout', auth, async (req, res) => {
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
});

// Logging out from all sessions
userRouter.post('/users/logoutAll', auth, async (req, res) => {
	const { user } = req;

	try {
		user.tokens = [];

		await user.save();

		res.status(200).send();
	} catch (err) {
		res.status(500).send();
	}
});

// Get profile
userRouter.get('/users/me', auth, async (req, res) => {
	try {
		res.send(req.user);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

// Get an user by his id
// userRouter.get('/users/:id', async (req, res) => {
// 	const _id = req.params.id;

// 	try {
// 		const user = User.findById(_id);
// 		if (!user) {
// 			res.status(404).send({
// 				error: 'No user found for corresponding id',
// 			});

// 			return;
// 		}

// 		res.send(user);
// 	} catch (err) {
// 		res.status(404).send({ error: 'No user found for corresponding id' });
// 	}
// });

// Update an user by his id
userRouter.patch('/users/me', auth, async (req, res) => {
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
});

// Delete and use by his id
userRouter.delete('/users/me', auth, async (req, res) => {
	try {
		// we can also use:
		// await req.user.delete()

		await req.user.remove();

		res.send(req.user);
	} catch (err) {
		res.status(400).send({ error: 'Bad request' });
	}
});

const upload = multer({
	dest: 'avatars',
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload an image'));
		}

		cb(undefined, true);
	},
});

userRouter.post(
	'/users/me/avatar',
	upload.single('avatar'),
	async (req, res) => {
		res.send();
	}
);

module.exports = userRouter;
