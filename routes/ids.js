var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:ids', function(req, res, next) {
  console.log("asdasd");
  res.render('ids', { title: 'Governify App' });
});

module.exports = router;
