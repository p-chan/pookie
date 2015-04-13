var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sess = req.session.me;
  if (!sess) { // Not Login
    res.render('index_guest', {
      title: 'POOKIE'
    });
  } else { // Login
    res.render('index', {
      title: 'POOKIE',
      user: sess[0].screen_name
    });
  };
});

module.exports = router;
