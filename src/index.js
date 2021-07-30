const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user.router');
const taskRouter = require('./routers/task.router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});

// const Task = require('./models/task.model');
// const User = require('./models/user.model')
// const main = async () => {
// 	// const task = await Task.findById('610436c074b15a36583cba3c');

// 	// await task.owner.populate('id').execPopulate();

// 	// console.log(task);

// 	const user = await User.findById('610440522a19c10e0888ca14');
// 	await user.populate('tasks').execPopulate();
// 	console.log(user.tasks);
// }

// main();
