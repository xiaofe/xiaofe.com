var xmlBuilder = require('../buildxml');

function drama(reqData){
	var data = {
		fromUserName : reqData.fromUserName,
		content : "查看正在追的美剧们~ :D <a href='http://xiaofe.com/drama/index.html?u=" + reqData.fromUserName + "'>>>传送门</a>"
	}
	return xmlBuilder("text", data);
};

module.exports = drama;