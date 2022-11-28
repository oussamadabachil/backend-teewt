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
    res.json({ result: false, message: "Remplissez tous vos champs 😑" });
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
        image: req.body.image,
      });

      newUser.save().then(() => {
        res.json({
          message: "Inscription effectuée",
          result: true,
          user: newUser,
        });
      });
    } else {
      res.json({ result: false, message: "L'utilisateur existe déja 😶" });
    }
  });
});

//How many poeples are connected
router.get("/connected", (req, res) => {
  User.find().then((data) => {
    res.json({ result: true, data: data });
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, message: "Remplissez tous vos champs 😑" });
    return;
  }
  User.findOne({ username: req.body.username }).then((data) => {
    if (data == null) {
      res.json({ result: false, message: "Utilisateur non trouvé 😶‍🌫️"  });
    } else {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, user: data, message: "Connexion réussie ✅" });
      } else {
        res.json({ result: false, message: "Mot de passe incorrect ❌" });
      }
    }
  });
});

const regexHashTag = /(#+[a-zA-Z0-9(_)]{1,})/;

router.post("/tweets", (req, res) => {
  if (!checkBody(req.body, ["content"])) {
    res.json({ result: false, message: "Vous n'avez rien saisi 😒" });
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


    if(req.body.content.match(regexHashTag)){
        let hashtag = req.body.content.match(regexHashTag)[0];
        hashtag = hashtag.replace("#", "")
        const newTweet = new Tweet({
          firstname: req.body.firstname,
          username: req.body.username,
          content: req.body.content,
          hashtag: hashtag

        })
        newTweet.save().then(() => {
          res.json({
            message: "Tweet envoyé",
            result: true,
            tweet: newTweet,
            });
        });


    }else{
        let hashtag = null;
        const newTweet = new Tweet({
          firstname: req.body.firstname,
          username: req.body.username,
          content: req.body.content,
          hashtag: hashtag,
        
        })
        newTweet.save().then(() => {
          res.json({
            message: "Tweet envoyé",
            result: true,
            tweet: newTweet,
            });
        })
      }
    } else {
    res.json({
      result: false,
      message: "Votre tweet est trop long, il doit faire moins de 280 caractères 😯",
    });
  }
});

//fais un get pour recuperer les tweets par hashtag




//router to find tweet by hashtag


router.get("/tweets/hashtag/:hashtag", (req, res) => {
  let hashtag = req.params.hashtag;

  Tweet.find({ hashtag: hashtag }).then((data) => {

    if(data.length > 0){
      res.json({ result: true, tweets: data });
    }else{
      res.json({ result: false, message: "Aucun tweet trouvé 😪" });
    }

  });
});


// DISPLAY ALL TWEETS WITH HASHTAGS

router.get("/tweets", (req, res) => {
  Tweet.find({}).then((data) => {
    if (data) {
      res.json({
        allTweet: data,
        result:true,
      });
    } else{
      res.json({
        message: "oussama",
        result: false,
      });
    }
  });
});

// SEARCH HASHTAG ROOTS

//Like and dislike

router.post("/tweets/:id/like", (req, res) => {
  Tweet.findOne({ _id: req.params.id }).then((data) => {
    if (data == null) {
      res.json({ result: false, message: "Tweet non trouvé" });
    } else {
      if (data.like.includes(req.body.username)) {
        res.json({ result: false, message: "Vous avez déjà liké ce tweet" });
      } else {
        data.like.push(req.body.username);
        data.save().then(() => {
          res.json({ result: true, message: "Like ajouté" });
        });
      }
    }
  });
});


router.delete("/tweets/delete/:idTweet", (req, res) => {
  Tweet.findOneAndDelete({ _id: req.params.idTweet }).then((data) => {
    if (data) {
      res.json({
        data,
        result:true,
      message: "Tweet supprimé 👍",});
    } else {
      res.json("rien");
    }
  });
});


router.delete("/alltweets/delete", (req, res) => {
  Tweet.deleteMany().then((data) => {
    if (data) {
      res.json({
        data,
        result:true,
      message: "Tous les tweets ont été supprimés",});
    } else {
      res.json({
        result:false,

      })
    }
  });
});


module.exports = router;
