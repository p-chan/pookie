var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess = req.session.me[0];
  if (!sess) {
    res.redirect('/login');
  } else {
    res.render('index', {
      title: sess.screen_name
    });
  };
});

module.exports = router;
