var auth = require('../modules/auth');
var main = require('../modules/main');
var token = "XIAOFE";
var libxmljs = require("libxmljs");

exports.getToken = function (req, res){
	var qureyString = req.query;
	console.log('signature : ', qureyString.signature, ", timestamp : ", qureyString.timestamp, ", nonce : ", qureyString.nonce);

	if (auth(token, qureyString.timestamp, qureyString.nonce, qureyString.signature)){
		res.send(qureyString.echostr);
		console.log('auth passed!');
	} else {
		console.log('auth failed');
		res.send('auth failed');
	}
	res.end();
};


function XMLBodyParse(data){
	var doc = libxmljs.parseXmlString(data);
	var msgType = doc.get('//MsgType').text();
	var obj = {};
	switch (msgType){
		case "text" : 
			obj = {
				"fromUserName" : doc.get('//FromUserName').text(),
				"msgType" : doc.get('//MsgType').text(),
				"content" : doc.get('//Content').text()
			};
			break;
		case "event" :
			obj = {
				"fromUserName" : doc.get('//FromUserName').text(),
				"msgType" : doc.get('//MsgType').text(),
				"event" : doc.get('//Event').text()
			}
			break;
		default : 
			obj = {
				"fromUserName" : doc.get('//FromUserName').text(),
				"msgType" : doc.get('//MsgType').text()
			}
			break;
	}
	return obj
};

exports.postReq = function (req, res){
	console.log('post received!');

	var qureyString = req.query,
		resData = "";
	// console.log('signature : ', qureyString.signature, ", timestamp : ", qureyString.timestamp, ", nonce : ", qureyString.nonce);

	var body = "";
	req.on("data", function (data) {
		body += data;
	});
	req.on("end", function(){
		reqData = XMLBodyParse(body);
		console.log('=============================');
		console.log(JSON.stringify(reqData));

		// res.send(main(reqData));
		// res.end();
		main(reqData, res);
	});
	req.on("error",function(e){
		//console.log('problem with request: ' + e.message);
	});
};