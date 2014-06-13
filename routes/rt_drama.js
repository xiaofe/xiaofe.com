var db = require('../modules/db');

var closeTimer = null;

var sql = {
	getByUid : "SELECT a.id, a.title, a.poster, a.this_week AS watched, b.abbr AS 'site_abbr', b.name AS 'site_name', a.ep_num FROM drama.dramainfo AS a, drama.siteinfo AS b WHERE (a.site = b.id AND a.uid = '$uid$' AND a.isdeleted = 0)",
	getByDramaId : "SELECT ep_num FROM drama.dramainfo WHERE (uid = '$uid$' AND id = '$dramaid$')",
	setEp : "UPDATE drama.dramainfo SET ep_num = $ep_num$ WHERE (uid = '$uid$' AND id = '$dramaid$')",
	setWatched : "UPDATE drama.dramainfo SET this_week = $stat$ WHERE (uid = '$uid$' AND id = '$dramaid$')",
	delDrama : "UPDATE drama.dramainfo SET isdeleted = 1, delete_time = '$deltime$' WHERE (uid = '$uid$' AND id = '$dramaid$')",
	aliasToUid : "SELECT uid FROM common.user_alias WHERE common.user_alias.alias = '$uid$'"
};

function checkOpen(){
	if (!db.isOpen()){
		db.open('drama_root', 'drama_root');
	}
}

/*
 * get some uid's drama data
 * @param {String} uid uid
 */
function getData(uid, res){
	checkOpen();
	var _query = sql.getByUid.replace(/\$uid\$/, uid);
	db.doQuery(_query, function (err, value){
		if (err){
			res.json({ret : value});
			return;
		}
		// console.log(':: get database successed! uid = ' + uid + ';');
		res.json({ret : 0, data : value});
	});
};

/*
 * set some dramaid of some uid's ep_num
 * @param {String} uid uid
 * @param {String} dramaid uid
 * @param {Number} offset [-1|1] add or plus one ep_num
 */
function setEpData(uid, dramaid, offset, res){
	checkOpen();
	var _getQuery = sql.getByDramaId.replace(/\$uid\$/, uid).replace(/\$dramaid\$/, dramaid),
		_setQuery = '',
		cur_ep = 0,
		set_ep = 0;
	offset = +offset > 0 ? 1 : -1;
	db.doQuery(_getQuery, function (err, value){
		if (err){
			res.json({ret : value});
			return;
		}
		cur_ep = value[0].ep_num;
		set_ep = Math.max(1, cur_ep + offset);
		_setQuery = sql.setEp.replace(/\$ep_num\$/, set_ep).replace(/\$uid\$/, uid).replace(/\$dramaid\$/, dramaid);
		db.doQuery(_setQuery, function (err, value){
			if (err){
				res.json({ret : value});
				return;
			}
			// console.log(':: set database successed! dramaid = ' + dramaid + '; offset = ' + offset + ';');
			res.json({ret : 0, data : {ep_num : set_ep, id : dramaid}});
		});
	});
};

function setWatchedData(uid, dramaid, stat, res){
	checkOpen();
	stat = stat > 0 ? 1 : 0;
	var _setQuery = sql.setWatched.replace(/\$stat\$/, stat).replace(/\$uid\$/, uid).replace(/\$dramaid\$/, dramaid);
	db.doQuery(_setQuery, function (err, value){
		if (err){
			res.json({ret : value});
			return;
		}
		res.json({ret : 0});
	});
};

function delDramaData(uid, dramaid, res){
	checkOpen();
	var _delQuery = sql.delDrama.replace(/\$deltime\$/, (new Date).getTime()).replace(/\$uid\$/, uid).replace(/\$dramaid\$/, dramaid);
	db.doQuery(_delQuery, function (err, value){
		if (err){
			res.json({ret : value});
			return;
		}
		res.json({ret : 0});
	});
}

function aliasToUid(uid, cb){
	checkOpen();
	var _query = sql.aliasToUid.replace(/\$uid\$/, uid);
	db.doQuery(_query, function (err, value){
		if (err){
			res.json({ret : value});
			return;
		}
		cb(value);
	})	
}

exports.rt_drama = function (req, res){
	var cmd = req.param('method'), 
		_uid = req.param('uid'),
		dramaid = req.param('dramaid');
	var key, value;

	if (!_uid || !cmd){
		return;
	}
	function process(uid){
		uid = uid || _uid;
		if (cmd == 'get'){
			getData(uid, res);
		} else if (cmd == 'setep'){
			setEpData(uid, dramaid, req.param('trans'), res);
	// } else if (cmd == 'del'){
	// 	delData(uid, req.param('key'), res);
		} else if (cmd == 'setwatched'){
			setWatchedData(uid, dramaid, req.param('stat'), res);
		} else if (cmd == 'deldrama'){
			delDramaData(uid, dramaid, res);	
		} else {
			res.send({'ret' : '-99', 'msg' : 'unexcepted drama command'});
		}
	}
	
	
        if (_uid.length <= 16){
                aliasToUid(_uid, function (value){
			var thisUid = '';
			value = value && value.length ? value[0] : null;
			if (value){
				thisUid = value.uid;
			}
			process(thisUid);
		});
        } else {
		process();
        }
}
