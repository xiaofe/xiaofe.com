/**
 * http://fanyi.youdao.com/openapi.do?keyfrom=xiaofe-lab&key=1381493534&type=data&doctype=<doctype>&version=1.1&q=要翻译的文本
 * 版本：1.1，请求方式：get，编码方式：utf-8
 * 主要功能：中英互译，同时获得有道翻译结果和有道词典结果（可能没有）
 * 参数说明：
 * 　type - 返回结果的类型，固定为data
 * 　doctype - 返回结果的数据格式，xml或json或jsonp
 * 　version - 版本，当前最新版本为1.1
 * 　q - 要翻译的文本，不能超过200个字符，需要使用utf-8编码
 * errorCode：
 * 　0 - 正常
 * 　20 - 要翻译的文本过长
 * 　30 - 无法进行有效的翻译
 * 　40 - 不支持的语言类型
 * 　50 - 无效的key
 *
 * API key：1381493534
 * keyfrom：xiaofe-lab
 * 
 * {
 *     "errorCode":0
 *     "query":"翻译",
 *     "translation":["translation"], // 有道翻译
 *     "basic":{ // 有道词典-基本词典
 *         "phonetic":"fān yì",
 *         "explains":[
 *             "translate",
 *             "interpret"
 *         ]
 *     },
 *     "web":[ // 有道词典-网络释义
 *         {
 *             "key":"翻译",
 *             "value":["translator","translation","translate","Interpreter"]
 *         },
 *         {...}
 *     ]
 * }
 * 
 */

var xmlBuilder = require('../buildxml');
var http = require('http');

var errCodeMap = {
	20 : '要翻译的文本过长',
	30 : '无法进行有效的翻译',
	40 : '不支持的语言类型',
	50 : '无效的key'
}

function process(reqData, youdaoRes){
	var transResult = '';
	if (youdaoRes.errorCode == 0 && youdaoRes.basic){
		transResult = youdaoRes.query + " " + youdaoRes.translation
						+ '\n'
						+ '[' + youdaoRes.basic.phonetic + ']'
						+ '\n==========\n'
						+ youdaoRes.basic.explains.join('\n');
	} else if (youdaoRes.errorCode == 0 && !youdaoRes.basic){
		transResult = youdaoRes.query;
	} else {
		transResult = 'translate error : ' + youdaoRes.errorCode + '(' + errCodeMap[youdaoRes.errorCode] + ')';
	}

	var wxData = {
		fromUserName : reqData.fromUserName,
		content : transResult
	};
	return xmlBuilder('text', wxData);
}

function translate (reqData, oRes){
	var _ydReq = http.request({
		hostname : 'fanyi.youdao.com',
		path : '/openapi.do?keyfrom=xiaofe-lab&key=1381493534&type=data&doctype=json&version=1.1&q=' + reqData.content,
		method : 'get'
	}, function (res){		
		var _resBody = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk){
			_resBody += chunk;
		});
		res.on('end', function (data){
			oRes.send(process(reqData, JSON.parse(_resBody)));
			oRes.end();
		});
	});

	_ydReq.end();
}

module.exports = translate;
