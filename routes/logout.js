var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    res.render('logout', {
      title: 'POOKIE'
    });
  });
});

module.exports = router;
