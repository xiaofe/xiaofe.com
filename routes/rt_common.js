function main (req, res){
	var _path = req.path,
		_key = _path.match(/\/common\/([^\/]*)/),
		_m, _mName;
	if (_key){
		_key = _key[1];
	} else {
		res.render('index');
		//res.send('Cannot find common key');
	}
	try{
		_m = require('../modules/common/' + _key);
		_m(req, res);
	} catch (_){
		res.render('index');
		//res.send(_key + ' : no this module');
	}
}

module.exports = main;
