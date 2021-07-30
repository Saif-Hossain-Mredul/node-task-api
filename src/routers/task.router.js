const express = require('express');

const Task = require('../models/task.model');
const auth = require('../middlewares/auth.middleware');

const taskRouter = new express.Router();

// Create new task
taskRouter.post('/tasks', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: {
			ownerName: req.user.name,
			id: req.user._id,
		},
	});

	try {
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

// Get the list of all task
taskRouter.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (err) {
		res.send({ error: err.message });
	}
});

// Get a single task by id
taskRouter.get('/tasks/:id', async (req, res) => {
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

// Update an existing task
taskRouter.patch('/tasks/:id', async (req, res) => {
	const allowedUpdates = ['description', 'completed'];
	const requestedUpdates = Object.keys(req.body);
	const isAllowed = requestedUpdates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isAllowed)
		return res.status(400).send({ error: 'Invalid update field' });

	try {
		const task = await Task.findById(req.params.id);

		requestedUpdates.forEach(
			(updateField) => (task[updateField] = req.body[updateField])
		);

		await task.save();

		// const updatedTask = await Task.findByIdAndUpdate(
		// 	req.params.id,
		// 	req.body,
		// 	{
		// 		new: true,
		// 		runValidators: true,
		// 	}
		// );

		if (!task)
			return res
				.status(404)
				.send({ error: 'Can not find any task with this id' });

		res.send(updatedTask);
	} catch (err) {
		res.status(400).send(err);
	}
});

// Delete a task by id
taskRouter.delete('/tasks/:id', async (req, res) => {
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

module.exports = taskRouter;
