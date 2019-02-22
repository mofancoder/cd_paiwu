
//说明 所有的元素以ul li ul li ul li的循环格式嵌套 如果没有下级分类 就用li a结束嵌套
$(document).ready(function () {
    // $(".left_wrap").find("li:has(ul)").children('.nav_title').click(function (e) {
    $('.nav_title').click(function (e) {
        //点击波浪效果
        if ($(this).find(".ink").length === 0) {
          /*  $(this).prepend("<span class='ink'></span>");*/
        }
        ink = $(this).find(".ink");
        ink.removeClass("animate_ink");

        if (!ink.height() && !ink.width()) {
            d = Math.max($(this).outerWidth(), $(this).outerHeight());
            ink.css({height: d, width: d});
        }
        x = e.pageX - $(this).offset().left - ink.width() / 2;
        y = e.pageY - $(this).offset().top - ink.height() / 2;
        ink.css({top: y + 'px', left: x + 'px'}).addClass("animate_ink");
        //点击波浪效果 --end
        if($(this).attr("href")==null || $(this).attr("href")==undefined ){

        }else{
            location.href=$(this).attr("href");
        }

        $(".nav_title_active").removeClass("nav_title_active");
        $(".nav_title_a").removeClass("nav_title_a");

        if ($(this).next("ul").is(":hidden")) {
            $(this).next("ul").slideDown("slow");
            $(this).addClass("nav_title_active");
            if ($(this).parent("li").siblings("li").children("ul").is(":visible")) {
                $(this).parent("li").siblings("li").find("ul").slideUp("1000");
                $(this).parent("li").siblings("li").find(".nav_title").removeClass("nav_title_active");
            }
            return false;
        } else {
            $(".li_active").removeClass("li_active");
            $(this).next("ul").slideUp("normal");
            $(this).removeClass("nav_title_active");
            $(this).addClass("nav_title_a");
            $(this).parent("li").siblings("li").find("ul").slideUp("1000");
            //不用toggle()的原因是为了在收缩菜单的时候同时也将该菜单的下级菜单以后的所有元素都隐藏
            $(this).next("ul").children("li").find("ul").fadeOut("normal");
            $(this).next("ul").find("li:has(ul)").children('.nav_title').removeClass("nav_title_active");
            return false;
        }
    });

    //点击 二级 菜单 切换
    $(".child li").click(function (e) {
        $(".li_active").removeClass("li_active");
        $(this).addClass("li_active");
    });
});

// 模拟select
$(function () {
    $(".dropdown-btn").click(function () {
        event.stopPropagation();
        var $that = $(this);
        if ($that.hasClass("dropdown-toggle")) {
            $that.parents(".btn-group").removeClass("open");
        } else {
            $that.parents(".btn-group").addClass("open");
        }
        $that.toggleClass("dropdown-toggle");

        $(".dropdown-menu li").click(function () {
            var select_name = $(this).text();
            $(this).parents('.btn-group').find(".select_name").text(select_name);

        });
    });

    $("html").on("click", function () {
        event.stopPropagation();
        //console.log("关闭");
        $(".dropdown-btn").removeClass("dropdown-toggle");
        $(".btn-group").removeClass("open")
    });
});

$(document).ready(function(){
    $(".right_ico").click(function(){
        $(this).toggleClass("current");
        $(this).parent().find(".tablet_a").slideToggle();
    });
});
