
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	favicon = require('serve-favicon'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	logger = require('morgan'),
	methodOverride = require('method-override'),
	rt_common = require('./routes/rt_common'),
	// rt_drama = require('./routes/rt_drama'),
	path = require('path');

// var weixin = require('./routes/weixin');

var app = express();
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
// app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/upload/img'}));
app.use(compress());
app.use(methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), {maxAge : 604800000}));


app.get('/', function (req, res){
	res.sendfile(__dirname + '/public/index.html');
});
app.all('/common/?*', rt_common);
// app.get('/drama', rt_drama.rt_drama);
// app.get('/weixin/interface', weixin.getToken);
// app.post('/weixin/interface', weixin.postReq);

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
    message: err.message,
    error: {}
  });
});

module.exports = app
