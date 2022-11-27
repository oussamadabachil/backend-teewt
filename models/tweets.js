const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
	username: String,
	tweetId: String,
	nbreLike: Number,
});

const tweetSchema = mongoose.Schema({
	firstname: String,
	username: String,
	content:String,
	hashtag:String,
    date: Date,
	likes: [likeSchema],
});



const Tweet = mongoose.model('tweets', tweetSchema);


module.exports = Tweet;