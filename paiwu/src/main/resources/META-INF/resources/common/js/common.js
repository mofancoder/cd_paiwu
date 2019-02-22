// by linzhaohai,qq:3026026,seaou.com

$(function() {

	$("#jytj_list .scroll_con .chart_list").switchable({
		/* triggerType: "click", */
		triggers : $("#jytj_list .box_nav li > a"),
		effect : 'scrollLeft',
		/* autoplay:'true', */
		speed : .3,
		autoplay : false,
		end2end : true
	/* loop: false, */

	});
});

$(function() {

	var left_sub_nav = $(".left_nav li dl");
	left_sub_nav.hide().filter(":first").show();

	$(".left_nav li > a").click(function() {
		/* $('ul.left_nav li dl').slideUp(300); */
		$(this).parent("li").siblings("li").children("dl").slideUp(300);
		$(".left_nav li > a").removeClass("current");
		$(this).addClass("current");
		$(this).next("dl").slideDown(300);
		return false;
	}).filter(":first").click();

	$(".left_nav li dl a").click(function() {
		$(".left_nav li dl a").removeClass("current");
		$(this).addClass("current");
	});

	var jrhy_cons = $("#jrhy_list .con > ul");
	jrhy_cons.hide().filter(":first").show();

	$("#jrhy_list ul.box_nav li > a").mouseover(function() {
		jrhy_cons.hide();
		jrhy_cons.filter(this.hash).show();
		$("#jrhy_list ul.box_nav li > a").removeClass("current");
		$(this).addClass("current");
		return false;
	}).filter(":first").mouseover();

	/*$(".role_box h1 a").click(function() {
		$("ul.role_choose").slideToggle(300);
		$(this).toggleClass("active");
		 //$(this).parents(".role_box").stop().animate({height:"210px"},"300"); 
	});*/
	
	$(".role_box ul").hover(function() {
		$("ul.role_choose").show(300);
		$(this).toggleClass("active");
		/* $(this).parents(".role_box").stop().animate({height:"210px"},"300"); */
	},function(){});
	$(".common_wrap").hover(function(){},function() {
		$("ul.role_choose").hide(300);
	});

	/*$(".top_wrap .ui_setting").click(function() {
		$(this).toggleClass("active");
		$(".setting_box").toggle(300)
	});*/
	
	$(".top_wrap .ui_setting").hover(function () {
		$(this).toggleClass("active");
		$(".setting_box").show(300);
	},function(){
		$(this).toggleClass("active");
		/*$(".setting_box").toggle(300);*/
	});
	$(".top_wrap").hover(function () {},function(){
		//$(this).toggleClass("active");
		$(".setting_box").hide(300);
	});

	
	$(".week_list li a").click(function(){
										$(".modify_calendar").fadeIn(300);
										$(".week_list li a").removeClass("active")
										$(this).addClass("active");
										});
	
	$(".modify_calendar a").click(function(){
										   $(".modify_calendar a").removeClass("active")
										   $(this).addClass("active");
										   });
	//收缩上侧
	$(".setting_box .hide_tools_wrap").click(function(){
		//$(".big_wrap").toggleClass("h_90");
		$(".tools_wrap").stop().slideToggle(80);										   
		$(this).hasClass("hide_bar")? $(this).html("<span>显示工具栏</span>").removeClass("hide_bar"):$(this).html("<span>隐藏工具栏</span>").addClass("hide_bar");
		//$(".big_wrap").hasClass("h_90")?$("ul.role_choose").css("top","89px"):$("ul.role_choose").css("top","169px");
		if(hideleftTop){
			$("#mainBody").layout("panel", "north").panel("resize", {
				height : 40
			});
		}else{
			$("#mainBody").layout("panel", "north").panel("resize", {
				height : 119
			});
		}
		hideleftTop = !hideleftTop;
		$("#mainBody").layout("resize");
		$("#tabs").tabs("resize");
	});

});

(function($) {
	$(window).load(function() {
		if ($(".left_nav").length > 0) {
			$(".left_nav").mCustomScrollbar({	
				autoHideScrollbar : true,
				theme : "dark",
				autoDraggerLength : false,
				alwaysShowScrollbar:true
			});
			$(".mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar").height("128px");		
		}
	});
})(jQuery);


/**
 * 主界面上打开或新增tab页面(列表页面使用)
 * 
 * @param iTabText
 *            tab标签标题名称
 * @param iUrl
 *            tab标签url
 * @param iTitleText
 *            tab标签鼠标放上显示文字
 * @param iGuid
 *            tab标签唯一性字段
 * @param iPassTitle
 *            true表示传递自身的title false表示不传递
 */
function showTab(iTabText, iUrl, iTitleText, iGuid, iPassTitle) {
	if (!iTabText)
		return;
	if (!iUrl)
		return;
	if (!iGuid)
		return;
	var titleText = iTitleText || '';
	var tabText = "<lable title='" + titleText + "'>" + iTabText
			+ "<span style='display:none'>" + iGuid + "</span></lable>";
	parent.addPanel(tabText, iUrl, iPassTitle);
}

// 增加扩展方法 getUrlParam
(function($) {
	$.getUrlParam = function(name) {

		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

		var r = window.location.search.substr(1).match(reg);

		if (r != null)
			return r[2];
		return null;

	}
})(jQuery);
