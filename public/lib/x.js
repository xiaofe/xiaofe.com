var X = {

	util : {

		getUrlParam : function (name){
			var re = new RegExp('(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)', 'i');
			var m = re.exec(window.location.href);
			return m ? m[1] : '';
		},

		tmpl : function (str, param){
			var argNames = [];
			var argValues = [];
			this.cache = this.cache || {};
			for (var a in param) {
				argNames.push(a);
				argValues.push(param[a]);
			}
			var funcs = this.cache[str] || function() {
				var f = [ 'var __out__ = [];' ];
				str.replace(/<%=([\d\D]*?)%>|<%([\d\D]*?)%>|([\d\D]+?)(?=<\%|$)/g, function($0, $1, $2, $3) {
					if ($3) {
						f.push('__out__.push(unescape("', escape($3), '"));');
					} else if ($1) {
						f.push('__out__.push(', $1, ');');
					} else if ($2) {
						f.push($2, ';');
					};
				});
				f.push('return __out__.join("")');
				return new Function(argNames.join(', '), f.join(''));
			}();
			this.cache[str] = funcs;
			return funcs.apply(param||{}, argValues);
		}
	},

	xhr : function (url, params, callback){
		var _xhr = new XMLHttpRequest();
		var _queryString = [];
		var _url = "";
		for (var i in params){
			_queryString.push(i + "=" + params[i]);
		}
		_queryString = _queryString.join("&");
		_url = url + "?" + _queryString;

		_xhr.open('get', _url, true);
		_xhr.onreadystatechange = function (){
			if(_xhr.readyState == 4){
				if(_xhr.status == 200){
					callback(JSON.parse(_xhr.responseText));
				}
			}
		};
		_xhr.send(null);
	}
};