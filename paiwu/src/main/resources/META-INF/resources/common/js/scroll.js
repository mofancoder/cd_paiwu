$(function() {
    $(window).scroll(function(){
        var scrolltop=$(this).scrollTop();
        if(scrolltop>=150){
            $("#pro-detail-hd").addClass("cc_top");
        }else{
            $("#pro-detail-hd").removeClass("cc_top");
        }
    });
});