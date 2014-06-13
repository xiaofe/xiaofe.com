
// var gm = require('gm').subClass({ imageMagick: true });
var http = require('http'),
	fs = require('fs');
var outDir = './public/gm/', ws;

function dlImg(url, cb){
	if (!url){
		return
	}
	http.get(url, function (res) {
		if (res.statusCode != 200){
			cb({ret : -1, msg : 'http request img failed', httpCode : res.statusCode});
			return;
		}
		if (res.headers['content-type'].indexOf('image') != 0){
			cb({ret : -2, msg : 'content-type is unexpected', contentType : res.headers['content-type']});
			return;
		}
        ws = fs.createWriteStream(outDir + 'ws_out.jpg', {flags : 'w'});
        res.pipe(ws);
        res.on('end', function (err){
        	cb({ret : 0, msg : 'save2local successed!', path : 'http://www.xiaofe.com' + outDir.slice(8) + 'ws_out.jpg'})
        })
    });

}

function main (req, res){
	var fromUrl = req.param('url');
	
	dlImg(fromUrl, function (ret){
		res.json(ret);
	});
}

module.exports = main;