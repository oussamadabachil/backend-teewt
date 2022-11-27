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
router.get("/test", (req, res) => {
  res.json({
    message: "Bienvenue BG",
  });
});
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({ result: false, message: "Remplissez tous vos champs" });
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
        res.json({
          message: "Inscription effectuée",
          result: true,
          user: newUser,
        });
      });
    } else {
      res.json({ result: false, message: "L'utilisateur existe déja" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, message: "Remplissez tous les champs !" });
    return;
  }
  User.findOne({ username: req.body.username }).then((data) => {
    if (data == null) {
      res.json({ result: false, message: "Utilisateur non trouvé" });
    } else {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, user: data, message: "Connexion réussie" });
      } else {
        res.json({ result: false, message: "Mot de passe incorrect" });
      }
    }
  });
});

const regexHashTag = /(#+[a-zA-Z0-9(_)]{1,})/;

router.post("/tweets", (req, res) => {
  if (!checkBody(req.body, ["content"])) {
    res.json({ result: false, message: "Remplissez tous vos champs !" });
    return;
  }
  if (req.body.content.length < 280) {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let time = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    const newTweet = new Tweet({
      firstname: req.body.firstname,
      username: req.body.username,
      content: req.body.content,
    });

    newTweet.save().then(() => {
      res.json({ result: true, tweet: newTweet , message: "Tweet envoyé" });
    });
  } else {
    res.json({
      result: false,
      message: "Votre tweet est trop long, il doit faire moins de 280 caractères",
    });
  }
});

// DISPLAY ALL TWEETS WITH HASHTAGS

router.get("/tweets", (req, res) => {
  Tweet.find({}, function (err, data) {
    if (data) {
      res.json({
        allTweet: data,
      });
    } else if (err) {
      res.json({
        azz: "oussama",
      });
    }
  });
});

// SEARCH HASHTAG ROOTS

router.get("http://localhost:3000/users/tweets/:hashtags", (req, res) => {
  Tweet.find({ hashtag: req.params.hashtags }, function (err, data) {
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

// DELETE TWEET ROOTS

// router.delete("/tweets/delete/:idTweet", (req, res) => {

//   Tweet.findOneAndDelete({_id:req.params.idTweet}).then((data) => {

//     if(data){
//       res.json(data)
//     }else{
//       res.json("rien")
//     }

//   })

// })

//router delete tweet

router.delete("/tweets/delete/:idTweet", (req, res) => {
  Tweet.findOneAndDelete({ _id: req.params.idTweet }).then((data) => {
    if (data) {
      res.json({
        data,
        result:true,
      message: "Tweet supprimé",});
    } else {
      res.json("rien");
    }
  });
});

//Router to find a tweet by Hashtag

module.exports = router;
