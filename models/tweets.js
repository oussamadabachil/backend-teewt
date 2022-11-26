const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
	firstname: String,
	username: String,
	content:String,
	hashtag:String,
    date: Date,
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;