const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		validate(email) {
			if (!validator.isEmail(email)) throw new Error('Invalid Email');
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate: (password) => {
			if (password.length < 6) {
				throw new Error('Password must be greater than 6 character');
			} else if (
				validator.default.matches(password.toLowerCase(), 'password')
			) {
				throw new Error("Password should not contain the word 'Password'");
			}
		},
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error('Age must be a positive number');
			}
		},
	},
});

// const newUser = new User({
// 	name: 'Saif hossain     ',
// 	email: 'atonlymesaif@gmail.com',
// 	age: 21,
// 	password: 'pass123word'
// });

// newUser
// 	.save()
// 	.then(() => console.log(newUser))
// 	.catch((err) => {
// 		console.log(err);
// 	});

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

const newTask = new Task({
	description: 'task four',
	// completed: false,
});

newTask
	.save()
	.then(() => console.log(newTask))
	.catch((err) => console.log(err));
