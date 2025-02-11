(function() {

window.mainVersion = '0.0.0.0001';

clearTimeout(window._t_loadDefault);
if (window._mainLoaded) {
	return;
}
window._mainLoaded = true;


//
require.config({baseUrl: "js/"});

require([currentVerPath + 'js/jquery-1.8.0.min.js'], function(){
	$(document.body).append('<div class="setup">\
							  <a href="#" class="setup-tit">\
								设置\
							  </a>\
							</div>\
							<!--end setup-->\
							<div class="wrap">\
							  <form id="search-form" action="http://www.so.com/s?src=360se6_addr&ie=utf-8" type="GET">\
								<input type="hidden" name="src" value="360se6_addr" />\
								<input type="hidden" name="ie" value="utf-8" />\
								<div class="search">\
									<div class="ipt">\
									  <div id="search-switch" class="search-engine">\
										<a href="#" class="so"></a>\
										<div class="search-arr"><span></span></div>\
									  </div>\
									  <!--end search-engine-->\
									  <input id="search-kw" name="q" type="text" _placeholder="综合搜索" />\
									</div>\
									<input class="btn" value="搜索" type="submit" />\
								</div>\
							  </form>\
							  <!--end search-->\
							  <div class="grid">\
								<div class="custom-mode-tips">\
								  请根据喜好自定义添加，删除，拖拽排列快速访问内容\
								  <a class="btn-close"></a>\
								</div>\
								<ul></ul>\
							  </div>\
							  <!--end grid-->\
							</div>\
							<!--end wrap-->\
							<form id="add-url-form">\
							  <div class="add-url" style="display:none;">\
								<input type="hidden" id="js-addurl-foridx" />\
								<div class="url-tit">\
								  <h2>\
									添加网址\
								  </h2>\
								  <a href="#" class="url-cls">\
								  </a>\
								</div>\
								<!--end url-tit-->\
								<ul class="url-list">\
								  <li>\
									名称：<input id="js-addurl-title" name="title" type="text" class="ipt-2"/>\
								  </li>\
								  <li>\
									网址：<input id="js-addurl-url" name="url" type="text" class="ipt-2" value="http://" />\
								  </li>\
								</ul>\
								<div class="url-box">\
								  <ul class="url-tag">\
									<li class="cur_">\
									  最常访问\
									</li>\
								  </ul>\
								  <div class="url-often">\
									<ul>\
									</ul>\
								  </div>\
								  <!--end url-con-->\
								</div>\
								<div class="url-b">\
								  <input id="js-addurl-confirm" class="btn-2" value="确定" type="submit" />\
								  <input id="js-addurl-cancel" class="btn-3" value="取消" type="reset" />\
								</div>\
							  </div>\
							</form>\
							<!--end add-url-->\
							\
							<ul class="search-menu" style="display:none">\
							  <li><a href="#" class="so"></a>综合搜索</li>\
							  <li><a href="#" class="google"></a>谷歌</li>\
							  <li><a href="#" class="baidu"></a>百度</li>\
							</ul>\
							\
							<div class="addurl-mask" style="display:none"></div>\
							<div class="remove-tips" style="display:none">您已删除缩略图 <a href="#" id="removeUrlsFromBlackList">撤销</a> <a href="#" id="clearBlackList">撤销全部</a></div>\
							\
							<div class="setup-pop" style="display:none;">\
							  <div class="setup-arr">\
								<span>\
								</span>\
							  </div>\
							  <a href="#" class="setup-cls">\
							  </a>\
							  <ul>\
								<li>\
								  <label><input type="checkbox" id="js-show-search-form" checked class="js-auto-save setup-opt" /> 显示搜索框</label>\
								</li>\
								<li>\
								  <label><input type="checkbox" id="js-show-in-newtab" class="js-auto-save setup-opt" /> 用新标签打开网址</label>\
								</li>\
							  </ul>\
							  <dl>\
								<dt>\
								  快速访问显示个数\
								</dt>\
								<dd>\
								  <select id="js-grid-count" class="js-auto-save">\
									<option value="0">0</option>\
									<option value="8" selected>8</option>\
									<option value="12">12</option>\
									<option value="16">16</option>\
									<option value="20">20</option>\
								  </select>\
								</dd>\
								<dt>\
								  快速访问显示内容\
								</dt>\
								<dd>\
								  <select id="js-grid-from" class="js-auto-save">\
									<option value="1">最常访问（自动根据访问次数调整）</option>\
									<option value="2">自定义（固定显示添加的网址）</option>\
								  </select>\
								</dd>\
							  </dl>\
							</div>\
							<!--end setup-pop-->\
							\
							<script type="text/template" id="tile-temp">\
							<li class="tile ${drag}"  url="${url}">\
							  <a class="link" url="${url}" href="${url}" title="${short_url}">\
								<div class="tile-logo">\
								  <img src="${logo}" />\
								  <div class="remove" title="删除"></div>\
								</div>\
								<div class="tile-tit">${title}</div>\
							  </a>\
							</li>\
							</script>\
							<script type="text/template" id="tile-add-temp">\
							<li class="tile ${drag}">\
							  <a>\
								<div class="tile-add">\
								  <img src="img/tile_add.png" />\
								  <img src="img/tile_addhov.png" style="display:none;">\
								</div>\
								<div class="tile-tit"></div>\
							  </a>\
							</li>\
							</script>\
							<script type="text/template" id="tile-empty-temp">\
							<li class="tile ${drag} empty-tile">\
							  <a class="link" url="">\
								<div class="tile-logo">\
								  <img />\
								</div>\
								<div class="tile-tit"></div>\
							  </a>\
							</li>\
							</script>');	
	});

	function loadCSS(url) {
		var link = document.createElement('link');
        document.getElementsByTagName("head")[0].appendChild(link);
		link.setAttribute("rel","stylesheet");
		link.setAttribute("href", url);
	}
	loadCSS(currentVerPath + 'css/styl.css');

	require([
		currentVerPath + "js/config.js", 
		currentVerPath + "js/jquery-ui-1.9.1.custom.min.js", 
		currentVerPath + "js/jquery.autocomplete.js", 
		currentVerPath + "js/jquery.validate.min.js", 
		currentVerPath + "js/storage_util.js", 
		currentVerPath + "js/new_page.js", 
		currentVerPath + "js/autoupdate.js", 
		currentVerPath + "js/stat.js", 
	]);

})();