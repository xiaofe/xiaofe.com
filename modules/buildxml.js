
function buildTextXml(data){
	var tmpl = '<xml>'
			+ '<ToUserName><![CDATA[$ToUserName$]]></ToUserName>'
			+ '<FromUserName><![CDATA[gh_1aeace34dad6]]></FromUserName>'
			+ '<CreateTime>' + Math.ceil((new Date).getTime() / 1000) + '</CreateTime>'
			+ '<MsgType><![CDATA[text]]></MsgType>'
			+ '<Content><![CDATA[$Content$]]></Content>'
		+ '</xml>';

 	return tmpl.replace(/\$ToUserName\$/, data.fromUserName)
 				.replace(/\$Content\$/, data.content);
};

function buildImgTextXml(data){
	console.log("buildImgTextXml inside~");
	return "";
};

var buildXml = function (type, data){
	if (typeof type === "undefined"){
		return false;
	} else if (type == "text"){
		return buildTextXml(data);
	} else if (type == "imgText"){
		return buildImgTextXml(data);
	}
}

module.exports = buildXml;