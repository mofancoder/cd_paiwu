/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function alertMessageParent(msg, title, icon, fn, fnParam){
	if(!isNotBlank(icon)){
		icon = 'warning';
	}
	var titleTmp = title;
	if(!isNotBlank(title)){ //title不存在赋默认值
		titleTmp = "提示";
	}
	$.messager.alert(titleTmp, msg, icon, function(){
		if(typeof(fn) === "function"){
			fn(fnParam);
		}
	});
}

function isNotBlank(value){
	if(value == undefined){
		return false;
	}
	if(value == "undefined"){
		return false;
	}
	if(value == null){
		return false;
	}
	if(value == "null"){
		return false;
	}
	if(value === ""){
		return false;
	}
	return true;
}

function showMessageParent(message, title, showType, showPosition ){
	/*
	showType：定义将如何显示该消息。可用值有：null,slide,fade,show。默认：slide。
	showSpeed：定义窗口显示的过度时间。默认：600毫秒。
	width：定义消息窗口的宽度。默认：250px。
	height：定义消息窗口的高度。默认：100px。
	title：在头部面板显示的标题文本。
	msg：显示的消息文本。
	style：定义消息窗体的自定义样式。
	timeout：如果定义为0，消息窗体将不会自动关闭，除非用户关闭他。如果定义成非0的树，消息窗体将在超时后自动关闭。默认：4秒。 
	*/
	var titleTmp = title;
	if(!isNotBlank(title)){ //title不存在赋默认值
		titleTmp = "提示";
	}
	
	var showTypeTmp = showType;
	if(!isNotBlank(showType)){
		showTypeTmp = 'slide';
	}
	if(!isNotBlank(showPosition) || showPosition == 'BottomRight'){
		$.messager.show({
			title: titleTmp,
			msg: message,
			showType: showTypeTmp
		});
		return;
	}
	
	var styleObj = {};
	if(showPosition == 'TopLeft'){
		//上左
		styleObj = {
			right:'',
			left:0,
			top:document.body.scrollTop+document.documentElement.scrollTop,
			bottom:''
		};
	}else if(showPosition == 'TopCenter'){
		//上中
		styleObj = {
			right:'',
			top:document.body.scrollTop+document.documentElement.scrollTop,
			bottom:''
		};
	}else if(showPosition == 'TopRight'){
		//上右
		styleObj = {
			left:'',
			right:0,
			top:document.body.scrollTop+document.documentElement.scrollTop,
			bottom:''
		};
	}else if(showPosition == 'CenterLeft'){
		//中左
		styleObj = {
			left:0,
			right:'',
			bottom:''
		};
	}else if(showPosition == 'Center'){
		//中
		styleObj = {
			right:'',
			bottom:''
		};
	}else if(showPosition == 'CenterRight'){
		//中右
		styleObj = {
			left:'',
			right:0,
			bottom:''
		};
	}else if(showPosition == 'BottomLeft'){
		//下左
		styleObj = {
			left:0,
			right:'',
			top:'',
			bottom:-document.body.scrollTop-document.documentElement.scrollTop
		};
	}else if(showPosition == 'BottomCenter'){
		//下中
		styleObj = {
			right:'',
			top:'',
			bottom:-document.body.scrollTop-document.documentElement.scrollTop
		};
	}else{
		//下右
		$.messager.show({
			title: title,
			msg: message,
			showType:'slide'
		});
		return;
	}

	$.messager.show({
		title: titleTmp,
		msg: message,
		showType:'slide',
		style:styleObj
	});
}

   
function confirmMessageParent(msg, title, fn, fnParam){
	var titleTmp = title;
	if(!isNotBlank(title)){ //title不存在赋默认值
		titleTmp = "确认";
	}
	$.messager.confirm(titleTmp, msg, function(r){
		if(r){
			if(typeof(fn) === "function"){
				fn(fnParam);
			}
		}
	});
}

function checkIEVersion(sysUrl, isIndex){
	try{
		var agent = navigator.userAgent.toLowerCase();
		var isIE = false;
		var ieVersion;
		if (/msie/.test(agent)){
			isIE = true; //ie 11 以下
			ieVersion = agent.match(/msie ([\d.]+)/)[1];
		}else if(agent.indexOf('trident') >= 0 && agent.indexOf('rv') >= 0){
			isIE = true; //ie 11 
			ieVersion = agent.match(/rv:(\d+\.\d+)/)[1];
		}
		if(isIE){
			var version=parseFloat(ieVersion);
			if(8 > version){
				if(!isIndex){
					alertMessageParent("请使用IE8以上！", '', '', changeToLogin, sysUrl);
				}else{
					alertMessageParent("请使用IE8以上！");
				}
			}else{
				try{
					var modeValue = parseFloat(document.documentMode);
					if(modeValue < 8){
						alert("请设置浏览器文档模式为IE8及以上！");
					}
				}catch(e){}
			}
		}else{
			if(!isIndex){
				alertMessageParent("请使用IE浏览器！", '', '', changeToLogin, sysUrl);
			}else{
				alertMessageParent("请使用IE浏览器！");
			}
		}
	}catch(e){
	}
}

function changeToLogin(sysUrl){
	top.location.href= sysUrl + '/login.html';
}
