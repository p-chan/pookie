var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:users', function(req, res, next) {
  var sess = req.session.me;
  if (!sess) { // Not Login
    res.render('users_guest', {
      title: 'POOKIE',
      description: 'Pookie is simply social bookmark service.'
    });
  } else { // Login
    res.render('users', {
      title: 'POOKIE',
      description: 'Pookie is simply social bookmark service.',
      name: sess[0].user_name,
      user: sess[0].screen_name
    });
  };
});

module.exports = router;
