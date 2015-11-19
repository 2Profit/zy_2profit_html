/* $(".help-L dl dt").click(function() {
			$(this).parent().find(".help-L-menu").slideToggle();
		})*/

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]);
	return null; //返回参数值
}

window.onload = function() {
	var hid = getUrlParam('id');
	// alert(hid)

	for (var i = 0; i < 7; i++) {
		var divInfo = document.getElementById('help' + (i + 1));
		divInfo.style.display = 'none';
	}
	var div = document.getElementById('help' + hid);
	div.style.display ="block";
}

function funcShow(id) {
	for (var i = 0; i < 7; i++) {
		var divInfo = document.getElementById('help' + (i + 1));
		divInfo.style.display = 'none';
	}
	var div = document.getElementById('help' + id);
	div.style.display = 'block';

}