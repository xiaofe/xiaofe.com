var xmlBuilder = require('../buildxml');

function welcome(reqData){
	var today = new Date;
	var _data = {
		fromUserName : reqData.fromUserName,
		content : "Welcome to XiaoFe's Lab!\n" 
					+ today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
	};
	return xmlBuilder("text", _data);
}

module.exports = welcome;