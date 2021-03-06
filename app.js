var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ids = require('./routes/ids');
var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'client', 'src', 'less'),{
    preprocess: {
        path: function(pathname, req) {
            return pathname.replace(path.sep + 'stylesheets' + path.sep, path.sep);
        }
    },
    dest: path.join(__dirname, 'client', 'public'),
    force: true,
    debug: true
}));
app.use(express.static(path.join(__dirname, 'client', 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'client', 'node_modules')));
if (app.get('env') === 'development') {
    app.use('/src/ts', express.static(path.join(__dirname, 'client', 'src', 'ts')));
}

app.use('/', index);
app.use('/ids', ids);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: 'Governify App',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Governify App',
    message: err.message,
    error: {}
  });
});


module.exports = app;