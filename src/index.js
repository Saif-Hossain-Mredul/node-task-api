const express = require('express');
require('./db/mongoose');

const Task = require('./models/task.model');

const userRouter = require('./routers/user.router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);

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

app.patch('/tasks/:id', async (req, res) => {
	const allowedUpdates = ['description', 'completed'];
	const requestedUpdates = Object.keys(req.body);
	const isAllowed = requestedUpdates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isAllowed)
		return res.status(400).send({ error: 'Invalid update field' });

	try {
		const updatedTask = await Task.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedTask)
			return res
				.status(404)
				.send({ error: 'Can not find any task with this id' });

		res.send(updatedTask);
	} catch (err) {
		res.status(400).send(err);
	}
});

app.delete('/tasks/:id', async (req, res) => {
	try {
		const deletedTask = await Task.findByIdAndDelete(req.params.id);

		if (!deletedTask)
			return res
				.status(404)
				.send({ error: 'Can not find any task with this id' });

		res.send(deletedTask);
	} catch (err) {
		res.status(400).send({ error: 'Bad request' });
	}
});

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
