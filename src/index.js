const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user.router');
const taskRouter = require('./routers/task.router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

// const jwt = require('jsonwebtoken');
// const secretKeys = require('./secret-keys');

// const myFunction = async () => {
// 	const token = jwt.sign({ _id: 'jksdhfjsdhj' }, secretKeys.TOKEN_SECRET_KEY);
// 	console.log(token);

// 	const data = jwt.verify(token, secretKeys.TOKEN_SECRET_KEY);
// 	console.log(data);
// };

// myFunction();

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
