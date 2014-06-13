
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	rt_common = require('./routes/rt_common'),
	rt_drama = require('./routes/rt_drama'),
	// rt_btc = require('./routes/rt_btc'),
	// user = require('./routes/user'),
	http = require('http'),
	path = require('path');

var weixin = require('./routes/weixin');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
// app.use(XMLBodyParse);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), {maxAge : 604800000}));

// development only
if ('development' == app.get('env')) {
  // app.use(express.errorHandler());
  app.use(function(err, req, res, next){
		console.error(err.stack);
		res.send(500, 'Something broke!');
	});
}

app.get('/', routes.index);
app.get('/common/?*', rt_common);
app.get('/drama', rt_drama.rt_drama);
app.get('/weixin/interface', weixin.getToken);
app.post('/weixin/interface', weixin.postReq);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
