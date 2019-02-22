// by linzhaohai,qq:3026026,seaou.com
$(function () {						
			//var help =  '<h3>一、项目信息步骤</h3>'+     '<div class="wz">1、¥8200有现货7天北京正元伟业科技发展有限公海淀</br>              2、¥8200	有现货	7天     </div>'+   '<div class="xstp"><img src="/control-center/res/common/img/01.gif" width="739" height="347" alt=""/></div>';
			var left_sub_nav = $(".left_nav li dl");
			left_sub_nav.hide().filter(":first").show();
		    //left_sub_nav.hide();
			
			$(".left_nav li > a").click(function () {
				/*$('ul.left_nav li dl').slideUp(300);*/
				$(this).parent("li").siblings("li").children("dl").slideUp(300);
				$(".left_nav li > a").removeClass("current");
				$(this).addClass("current");
				$(this).next("dl").slideDown(300);
				$("#mk").text($(this).text());
				$("#cd").text("");
				return false;
			}).filter(":first").click();
			
			$(".left_nav li dl a").click(function () {
												$(".left_nav li dl a").removeClass("current");
												$(this).addClass("current");
												$("#cd").text($(this).text());
												//$(".righta").html(help);
												});
			
			
			


			});
            
function getReqParam(url, paras){
	if(!url) return;
	if(!paras) return;
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
	var paraObj = {};  
	for (var i=0; j=paraString[i]; i++){  
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
	}  
	var returnValue = paraObj[paras.toLowerCase()];  
	if(typeof(returnValue)=="undefined"){  
		return "";  
	}else{  
		return returnValue.replace("#.html", "");  
	}  
}

/*function alertMessage(msg, title, icon, fn, fnParam){
	alertMessageParent(msg, title, icon, fn, fnParam)
}

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
}*/

//校验变量值是否为null或空字符（undefined、null、"" 返回true,其他返回false）
function isBlank(value){
	if(value == undefined){
		return true;
	}
	if(value == "undefined"){
		return true;
	}
	if(value == null){
		return true;
	}
	if(value == "null"){
		return true;
	}
	if(value === ""){
		return true;
	}
	return false;
}

//校验变量值是否为null或空字符（undefined、null、"" 返回false,其他返回true）
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
           

<!--//