// Last modification: 23-08-2018 17:27:54

/* Importação dos módulos utilizados */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

/* Carregamento das rotas disponíveis */
var indexRouter = require('./routes/index');
var customers = require('./routes/customerRoute');

/* Aplicativo web expresso */
var app = express();
// view engine sup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Rotas estáticas para recursos como css, imagens e outros */
app.use(express.static(path.join(__dirname, 'public')));

/* Definição das rotas disponíveis para a aplicação web e API RESTful */
app.use('/', indexRouter); //página inicial utilizado para visualização da aplicação web
app.use('/customers', customers); //utilizado somente como interface da API REST


/* Rotas de erro */
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
