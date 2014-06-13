var xmlBuilder = require('../buildxml');

function exception(reqData){
	// var _data = {
	// 	fromUserName : reqData.fromUserName,
	// 	content : reqData.content || "指令错误"
	// };
	return xmlBuilder("text", reqData);
}

module.exports = exception;