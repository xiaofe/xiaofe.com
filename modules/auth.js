

var auth = function (token, timestamp, nonce, signature){
	var arr = [];
	arr.push(timestamp);
	arr.push(nonce);
	arr.push(token);

	var d = require('crypto').createHash('sha1').update(arr.sort().join('').toString()).digest('hex');
	if (d == signature){
		return true;
	} else {
		return false;
	}
}

module.exports = auth;