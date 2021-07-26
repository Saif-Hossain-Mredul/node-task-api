const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

app.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

app.get('/users/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
	const task = new Task(req.body);

	try {
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

app.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (err) {
		res.send({ error: err.message });
	}
});

app.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const task = Task.findById(_id);
		if (!task) {
			return res
				.status(404)
				.send({ error: 'No user found for corresponding id' });
		}
		res.send(task);
	} catch (err) {
		res.status(404).send({ error: 'No task found for corresponding id' });
	}
});

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
