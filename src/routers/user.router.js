const express = require('express');

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
	const {user} = req;

	try {
		user.tokens = [];

		await user.save();

		res.status(200).send();
	} catch (err) {
		res.status(500).send();
	}
})

// Get profile
userRouter.get('/users/me', auth, async (req, res) => {
	try {
		res.send(req.user);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

// Get an user by his id
userRouter.get('/users/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const user = User.findById(_id);
		if (!user) {
			res.status(404).send({
				error: 'No user found for corresponding id',
			});

			return;
		}

		res.send(user);
	} catch (err) {
		res.status(404).send({ error: 'No user found for corresponding id' });
	}
});

// Update an user by his id
userRouter.patch('/users/:id', async (req, res) => {
	const requestedUpdates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isAllowed = requestedUpdates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isAllowed)
		return res.status(400).send({ error: 'Invalid update field' });

	try {
		const user = await User.findById(req.params.id);

		requestedUpdates.forEach((update) => (user[update] = req.body[update]));

		await user.save();

		if (!user)
			return res
				.status(404)
				.send({ error: 'Can not find user with this id' });

		res.send(user);
	} catch (err) {
		res.status(400).send({ error: 'Bad request' });
	}
});

// Delete and use by his id
userRouter.delete('/users/:id', async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);

		if (!deletedUser)
			return res
				.status(404)
				.send({ error: 'Can not find user with this id' });

		res.send(deletedUser);
	} catch (err) {
		res.status(400).send({ error: 'Bad request' });
	}
});

module.exports = userRouter;
