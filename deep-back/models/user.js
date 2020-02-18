const mongoose = require('mongoose');
const Entry = require('./entries')

const UserSchema = mongoose.Schema({
	account_type: {
		type: String,
		require: true
	},
	password: {
		type: Object,
		require: false
	},
	user: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	userID: {
		type: String,
		require: true
	},
	posts: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'Entry'
	}]
})


const User = module.exports = mongoose.model('User', UserSchema)