var mysql = require('mysql');
var pool = null;

var db = {};

db.isOpen = function (){
	if (!pool){
		return false;
	}
	return true;
};

db.open = function (user, password){
	if (!pool){
		pool = mysql.createPool({
			host : 'localhost',
			user : user,
			password : password
		});
	}
};

db.doQuery = function (sql, callback){
	if (!sql) {
		console.log('sql is undefined!');
		return;
	}
	if (!pool) {
		console.log('pool connection is out of service!');
		return;
	}
	pool.getConnection(function (err, connection){
		if (err){
			callback(true, 'getConnection error!');
		}
		connection.query(sql, function (err, result){
			// console.log("database query result : " + result);
			callback(false, result);
			connection.release();
		});
	});
};


module.exports = db;