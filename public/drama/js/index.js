(function (){

	var getById = function(id) {
		return document.getElementById(id);
	};

	var getByClass = function (className, target, all){
		var eles;
		if (!className){
			return
		}
		target = target || document.body;
		eles = target.getElementsByClassName(className);
		return eles && eles.length ? (all ? eles : eles[0]) : null;
	};

	var searchParent = function (start, condition){
		var node = start, _conditionTest;
		if (!condition){
			return node;
		}
		_conditionTest = condition(node);
		if (_conditionTest !== true && _conditionTest !== false){	// condition没有返回true/false
			return node;
		}
		while (!condition(node) && node != document.body){
			node = node.parentNode;
		}
		if (node == document.body){
			return null;
		} else {
			return node;
		}
	}

	var tmpl = [
		'<%for (var i = 0, one; one = data[i]; i++){%>',
		'<li id="item_<%=one.id%>" class="item<%if(one.watched){%> item_done<%}%>" data-index="<%=one.id%>">',
			'<div class="item_b">',
				'<img class="poster" src="img/poster/<%=one.poster%>" />',
				'<div class="info">',
					'<div class="title"><%=one.title%></div>',
					'<div class="site"><i class="ico ico_<%=one.site_abbr%>"></i><%=one.site_name%></div>',
					'<div class="ep" id="ep_num_<%=one.id%>">',
						'<i class="ep_num num_t"></i><i class="ep_num num_<%=Math.floor(one.ep_num / 10)%>"></i><i class="ep_num num_<%=one.ep_num % 10%>"></i>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="mask" style="display:none"></div>',
			'<div class="panel" style="display:none" data-action="close">',
				'<!--div class="close" data-action="close">×</div-->',
				'<div class="op">',
					'<button class="op_btn unwatch" data-action="unwatch">标记为未看</button>',
					'<button class="op_btn del" data-action="del">删除</button>',
				'</div>',
				'<div class="del_check" style="display:none">',
					'<p class="t">确认删除？</p>',
					'<p class="b">',
						'<button class="del_check_btn confirm" data-action="confirm">是</button>',
						'<button class="del_check_btn cancel" data-action="cancel">否</button>',
					'</p>',
				'</div>',
			'</div>',
		'</li>',
		'<%}%>'
	].join('');

	var epTmpl = '<i class="ep_num num_t"></i><i class="ep_num num_<%=Math.floor(ep_num / 10)%>"></i><i class="ep_num num_<%=ep_num % 10%>"></i>'

	var hoffset = voffset = 0,
		startX = startY = 0,
		itemHeight = itemWidth = 0,
		isMoving = false,
		clickHoldTimer = null,
		dramaElements = [];

	var uid = X.util.getUrlParam('u');

	function startHandler(evt, eventEle){
//		evt.preventDefault();
		if (isMoving || !evt.touches.length) {
			return;
		}
		var touch = evt.touches[0];
		startX = touch.pageX;
		startY = touch.pageY;
		hoffset = voffset = 0;
		isMoving = true;
		thisDramaId = this.parentNode.getAttribute('data-index');
		clickHoldTimer = new Date();

		//console.log('start moving : ' + startX + '-->' + startY);
	};

	function moveHandler(evt){
//		evt.preventDefault();
		if (!evt.touches.length){
			return;
		}
		var touch = evt.touches[0];
		hoffset = touch.pageX - startX;
		voffset = touch.pageY - startY;
	};

	function endHandler(evt){
//		evt.preventDefault();
		//console.log('end moving : ' + hoffset + '-->' + voffset);
		isMoving = false;
		processMoving();
		clickHoldTimer = (new Date()) - clickHoldTimer;
		if (clickHoldTimer > 1000){
		//	resetWatched();
			var target = evt.target;
			target = searchParent(target, function (ele){
				return ele.nodeName.toLowerCase() == 'li'
			});
			if (target.nodeName.toLowerCase() == 'li'){
				showMorePanel(target.getAttribute('id'));
			}
		}
		clickHoldTimer = null;
	};

	function hidePanel(id){
		if (id){
			var itemEle = getById('item_' + id);
			getByClass('mask', itemEle).style.display = 'none';
			getByClass('panel', itemEle).style.display = 'none';
			getByClass('op', itemEle).style.display = 'block';
			getByClass('del_check', itemEle).style.display = 'none';
		} else {
			var itemEles = getByClass('item', null, true);
			for (var i = 0, one, len = itemEles.length; i < len; i++){
				one = itemEles[i];
				getByClass('op', one).style.display = 'block';
				getByClass('del_check', one).style.display = 'none';
				getByClass('mask', one).style.display = 'none';
				getByClass('panel', one).style.display = 'none';
			}
		}
	}

	function showMorePanel(itemId){
		var itemEle = getById(itemId),
			id = itemEle.getAttribute('data-index'),
			maskEle = getByClass('mask', itemEle),
			panelEle = getByClass('panel', itemEle);

		hidePanel();
		maskEle.style.display = 'block';
		panelEle.style.display = 'block';
	}

	function processMoving(){
		if (Math.abs(hoffset) > itemWidth / 2 && Math.abs(voffset) < itemHeight){
			setEp(hoffset > 0 ? 1 : -1);
		}
	};

	function setEp(isAdd, dramaId){
		X.xhr('/drama', {method : 'setep', uid : uid, dramaid : dramaId || thisDramaId, trans : isAdd}, function (ret){
			if (ret.ret == 0){
				var data = ret.data;
				renderEP(data.id, data.ep_num);
				if (getById('item_' + data.id).className.indexOf('item_done') < 0){
					setWatched();
				}
			}
		});
	};

	function setWatched(dramaId){
		X.xhr('/drama', {method : 'setwatched', stat : '1', uid : uid, dramaid : dramaId || thisDramaId}, function (ret){
			if (ret.ret == 0){
				getById('item_' + thisDramaId).className = "item item_done";
			}
		});
	};

	function resetWatched(dramaId){
		X.xhr('/drama', {method : 'setwatched', stat : '0',  uid : uid, dramaid : dramaId || thisDramaId}, function (ret){
			if (ret.ret == 0){
				getById('item_' + thisDramaId).className = "item";
			}
		});
	}

	function delDrama(dramaId){
		var itemEle = getById('item_' + dramaId);
		getByClass('op', itemEle).style.display = 'none';
		getByClass('del_check', itemEle).style.display = 'block';
	}

	function doDelDrama(dramaId){
		var itemEle = getById('item_' + dramaId);
		X.xhr('/drama', {method : 'deldrama', uid : uid, dramaid : dramaId || thisDramaId}, function (ret){
			if (ret.ret == 0){
				itemEle.style.height = '0px';
				setTimeout(function (){
					itemEle.remove();
				}, 1000);
				hidePanel(dramaId);
			}
		});
	}

	function cancelDelDrama(dramaId){
		var itemEle = getById('item_' + dramaId);
		getByClass('op', itemEle).style.display = 'block';
		getByClass('del_check', itemEle).style.display = 'none';
	}

	function renderEP(index, ep_num){
		getById('ep_num_' + index).innerHTML = X.util.tmpl(epTmpl, {
			ep_num : ep_num
		});
	};

	function bindEvent(){
		for (var i = 0, one; one = dramaElements[i]; i++){
			one.addEventListener('touchstart', startHandler, false);
			one.addEventListener('touchmove', moveHandler, false);
			one.addEventListener('touchend', endHandler, false);
		}

		getById('drama_list').addEventListener('click', function (evt){
			var target = evt.target,
				action = target.getAttribute('data-action'), 
				itemEle,
				itemId;
			itemEle = searchParent(target, function (ele){
				return ele.nodeName.toLowerCase() == 'li' && ele.getAttribute('data-index') >= 0
			});
			itemId = itemEle.getAttribute('data-index');
			if (!action){
				target = searchParent(target, function (ele){
					return !!(action = ele.getAttribute('data-action'))
				});
			}
			if (action == 'close'){
				hidePanel(itemId);
			} else if (action == 'unwatch'){
				resetWatched(itemId);
				hidePanel(itemId);
			} else if (action == 'del'){
				delDrama(itemId);
			} else if (action == 'confirm'){
				doDelDrama(itemId);
			} else if (action == 'cancel'){
				cancelDelDrama(itemId);
			}
			evt.stopPropagation && evt.stopPropagation();
		}, false);
	};

	function renderPage(data){
		if (!data || !data.length){
			return;
		}
		getById('drama_list').innerHTML = X.util.tmpl(tmpl, {data : data});
		dramaElements = document.getElementsByClassName('item_b');

		var itemSize = dramaElements[0].getBoundingClientRect();
		itemHeight = itemSize['height'];
		itemWidth = itemSize['width'];
	}

	function init(){
		getById('cuid').innerHTML = uid;

		X.xhr('/drama', {method : 'get', uid : uid}, function (ret){
			if (ret.ret == 0){
				renderPage(ret.data);
				bindEvent();
			}
			// console.log(JSON.parse(ret));
		});
	}

	window.PAGE = window.PAGE || {};
	PAGE.init = init;
})();
