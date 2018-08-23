// Last modification: 21-08-2018 12:28:09
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('customer_table', { subtitle: 'Information Tecnology Inc.', title: 'iTools' });
});

module.exports = router;
