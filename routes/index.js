// Last modification: 23-08-2018 17:26:14

var express = require('express');
var router = express.Router();

/* Página inicial da aplicação, vai direto para a visualização dos clientes */
router.get('/', function(req, res, next) {
  res.render('customer_table', { subtitle: 'Information Tecnology Inc.', title: 'iTools' });
});

module.exports = router;
