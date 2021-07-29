const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
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

// Check the password and returns the authenticated user
userSchema.statics.findByCredentials = async ({email, password}) => {
	const user = await User.findOne({email});
	if (!user) {
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Unable to login');
	}

	return user;
}

// Hash the password before saving
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified(['password'])) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
