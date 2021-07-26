const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = User;