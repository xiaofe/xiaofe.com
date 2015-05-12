var fs = require('fs');
var outDir = './public/upload/img/';

function main (req, res){
	var uploadImg = req.files.img,
		oName = uploadImg.name.replace('..',''), 
		keepOName = !!req.param('keep'),
		targetName = keepOName ? oName : (new Date).getTime() + oName.slice(oName.lastIndexOf('.'));

//	console.log(uploadImg);

	fs.rename(uploadImg.path, outDir + targetName, function (err){
		if (err){
			res.end('rename error')	;
		} else {
			res.end("http://www.xiaofe.com/upload/img/" + targetName + ' : ok');

/*			fs.readFile(outDir + targetName, "binary", function (error,file){
				if(error){
					res.writeHead(500, {"Content-Type" : "text/plain"});
					res.write(error + "\n");
					res.end();
				}else{
					res.writeHead(200, {"Content-Type" : uploadImg.type});
					res.write(file,"binary");
					res.end();
			    }
			});*/
		}
	})
}

module.exports = main;
