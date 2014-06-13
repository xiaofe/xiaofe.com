var levelup = require('levelup');
var _db, _dbname;
var db = {};

db.open = function (dbname){
	_dbname = dbname;
	console.log("open db name : " + _dbname);
	_db = levelup("/media/warehouse/workspace/aliyun/server/db/" + _dbname);
};

db.close = function (){
	console.log("close db name : " + _dbname);
	_db && _db.close();
};

db.isOpen = function (){
	return _db && _db.isOpen();
};

db.get = function (uid, key, fn){
	if (!_db){
		console.log('dbError : database "' + _dbname + '" is not exist!');
		return _cb(true, 'dbError');
	}
	var _cb = fn;
	_db.get(uid, function (err, value){
		if (err){
			console.log('dbError : get "' + key + '"');
			return _cb(true, 'dbError');
		}
		_cb(null, JSON.stringify(value).key);
	})
};

db.add = function (uid, key, value, fn){
	if (!_db){
		console.log('dbError : database "' + _dbname + '" is not exist!');
		return _cb(true, 'dbError');
	}
	var _cb = fn, _data, _o;

	_db.get(uid, function (err, value){
		if (err){
			console.log('dbError : add "' + key + '"');
			return _cb(true, 'dbError');
		}
		var _o = JSON.parse(value);
		_o[key] = value;
		_db.put(uid, JSON.stringify(_o), function(err){
			if (err){
				console.log('dbError : add "' + key + '"');
				return _cb(true, 'dbError');
			}
			_cb(null);
		});
	});
};

db.del = function (uid, key, fn){
	if (!_db){
		console.log('dbError : database "' + _dbname + '" is not exist!');
		return _cb(true, 'dbError');
	}
	var _cb = fn;
	_db.del(key, function(err){
		if (err){
			console.log('dbError : del "' + key + '"');
			return _cb(true, 'dbError');
		}
		_cb(null);
	});
}

module.exports = db;