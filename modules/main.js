var drama = require('./apps/drama');
var exception = require('./apps/exception');
var translate = require('./apps/translate');
var welcome = require('./apps/welcome');


/**
 *	用户ID
 */

var UID = {
	XIAOFE : "otSznjq7RwQbFbm9ZD7qG3HkbIxA",	// 果果
	BOBO : "otSznjnLJt2enGmamzo1TWnw0XdI"		// 波波
};

var appAuthority = {
	"追剧" : [UID.XIAOFE].join(',')
}


function main (reqData, res){
	if (reqData.msgType == 'text'){
		var key = String.prototype.trim.call(reqData.content);
		console.log("process key ------------------>>> " + key);
		if (key == "追剧" && appAuthority[key].indexOf(reqData.fromUserName) > -1){		// 美剧追剧记录
			res.send(drama(reqData));
			res.end();
		} else if (/^[a-zA-Z]*$/.test(key)) {	// translate english words
			translate(reqData, res);
		} else {
			res.send(exception(reqData));
			res.end();
		}
	} else if (reqData.msgType == 'event' && reqData.event == 'subscribe'){
		res.send(welcome(reqData));
		res.end();
	} else {
		console.log(reqData.msgType);
	}
}

module.exports = main;