const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

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
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|mp3)$/)) {
			return cb(new Error('Please upload an image'));
		}

		cb(undefined, true);
	},
});

userRouter.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		console.log(req.file);

		try {
			const buffer = await sharp(req.file.buffer)
				.resize({ width: 250, height: 250 })
				.png()
				.toBuffer();

			req.user.avatar = buffer;
			await req.user.save();

			res.send();
		} catch (err) {
			console.log(err);
			res.status(400).send();
		}
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

userRouter.delete('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();

		res.send();
	} catch (err) {
		res.status(400).send();
	}
});

userRouter.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) throw new Error();

		// res.set('Content-Type', 'image/jpg')
		res.send(user.avatar);
	} catch (err) {
		res.status(404).send();
	}
});

module.exports = userRouter;
