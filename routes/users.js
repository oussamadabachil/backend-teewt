var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Tweet = require("../models/tweets");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { post } = require(".");

// SIGNUP ROOTS

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
    
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then(() => {
        res.json({ result: true, user: newUser });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ username: req.body.username }).then((data) => {
    if (data == null) {
      res.json({ result: false });
    } else {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, user: data });
      } else {
        res.json({ result: false });
      }
    }
  });
});
// SIGNIN ROOTS

// ADD TWEET ROOTS

// router.post("/tweets", (req, res) => {
//   if(req.body.content){
//   const newTweet = new Tweet({
//     firstname: req.body.firstname,
//     username: req.body.username,
//     content: req.body.content,
//     date: new Date(),
//   });
//   newTweet.save().then(() => {
//     res.json({ result: true, tweet: newTweet });
//   }
//   );
// }else{
//   res.json({result:false})

// }

// });

//how are

// router.post('/addtweet', (req, res) => {
//   if (!checkBody(req.body, ['content'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//   const newTweet = new Tweet({
//     firstname: req.body.firstname,
//     username: req.body.username,
//     content: req.body.content,
//     date: new Date(),
//   });
//   newTweet.save().then(() => {
//     res.json({ result: true, tweet: newTweet });
//   }
//   );
// });

//add tweet
const regexHashTag = /(#+[a-zA-Z0-9(_)]{1,})/;

router.post("/tweets", (req, res) => {
  if (!checkBody(req.body, ["content"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  if(req.body.content.length<280){
    const newTweet = new Tweet({
      firstname: req.body.firstname,
      username: req.body.username,
      content: req.body.content,
      date : new Date().getHours()
    });
  
    let hashtag = newTweet.content.match(regexHashTag);
  
    newTweet.save().then(() => {
      res.json({ result: true, tweet: newTweet});
    });
  }else{

    res.json({
      result:false,
      message:'hey '
    })
  }
  
});

// DISPLAY ALL TWEETS

router.get("/tweets", (req, res) => {
  Tweet.find({}, function (err, data) {
    if (data) {
      res.json({
        allTweet: data.sort(),
      });
    } else if (err) {
      res.json({
        azz: "oussama",
      });
    }
  });
});

// SEARCH HASHTAG ROOTS

router.get("/searchTweets", (req, res) => {
  res.json(tweet);
});

// DELETE TWEET ROOTS

// router.delete("/tweets/delete", (req, res) => {
 
//   Tweet.findOneAndDelete({_id:req.body.id}).then((data) => {


//     if(data){
//       res.json(data)
//     }else{
//       res.json("rien")
//     }

//   })



  
router.delete('/tweets/:id', (req, res) => {
  Tweet.findByIdAndDelete(req.params.id).then((data) => {
    if (data) {
      res.json(data)
    } else {
      res.json("rien")
    }
  })

 });


 

router.get("/user/infos", (req, res) => {
  User.findOne({ username: req.body.username }).then((data) => {});
});


router.get("/tweets/#hastags", (req, res) => {
  

})
module.exports = router;
