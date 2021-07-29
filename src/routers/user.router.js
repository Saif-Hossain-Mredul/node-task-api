const express = require('express');

const User = require('../models/user.model');

const userRouter = new express.Router();

// Create user route
userRouter.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

// Login user
userRouter.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials({ ...req.body });
		res.send(user);
	} catch (err) {
		res.status(400).send();
	}
});

// Get the list of all users
userRouter.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
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
