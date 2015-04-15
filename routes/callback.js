var express = require('express');
var mysql = require('mysql');
var twitterAPI = require('node-twitter-api');
var conf = require('../config.json');
var router = express.Router();

var twitter = new twitterAPI({
  consumerKey: conf.twitter.consumerKey,
  consumerSecret: conf.twitter.consumerSecret,
  callback: 'http://127.0.0.1:3000/callback'
});

/* GET users listing. */
router.get('/callback', function(req, res, next) {
  // GET REQ TOKEN
  if (!req.query.oauth_verifier) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
      if (error) {
        console.log("Error getting OAuth request token : " + error);
      } else {
        req.session.requestToken = requestToken;
        req.session.requestTokenSecret = requestTokenSecret;
        res.redirect(twitter.getAuthUrl(requestToken));
      }
    });
  } else {
    twitter.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
      if (error) {
        console.log(error);
      } else {
        twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, me, response) {
          if (error) {
            console.log(error);
          } else {
            var client = mysql.createConnection(conf.db);
            client.connect();
            client.query('select * from users where user_id = ' + me.id_str + ' limit 1;', function (err, user, fields) {
              if (err) console.log(err);
              if (!user.length) {
                var datetime = new Date();
                var insert_data = {
                  user_id: me.id_str,
                  user_name: me.name,
                  screen_name: me.screen_name,
                  access_token: accessToken,
                  access_token_secret: accessTokenSecret,
                  created: datetime,
                  modified: datetime
                }
                client.query('insert into users set ?', insert_data, function (err, result) {
                  if (err) console.log(err);
                  client.query('select * from users where user_id = ' + me.id_str + ' limit 1;', insert_data, function (err, user, fields) {
                    req.session.me = user;
                    client.end();
                    res.redirect('/');
                  });
                });
              } else {
                req.session.me = user;
                client.end();
                res.redirect('/');
              };
            });
          }
        });
      }
    });
  };
});

module.exports = router;
