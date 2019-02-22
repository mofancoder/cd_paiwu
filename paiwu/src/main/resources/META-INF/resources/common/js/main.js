$(function () {
    $(".table_con_list .table_details").hide();

    $(".table_title h2").click(function () {
        $(this).parent().siblings(".table_title").removeClass("current");
        $(this).parent().siblings(".table_title").find(".toggle_expand").removeClass("current");
        $(this).parent(".table_title").toggleClass("current");
        $(this).prev().children(".toggle_expand").toggleClass("current");
        $(this).parent().siblings(".table_title").next(".table_details").slideUp(300);
        $(this).parent(".table_title").next(".table_details").stop().slideToggle(300);
        if (typeof (afterTitleExpand) != "undefined") {
	            afterTitleExpand($(this));
	        }
	        return false;
	    });
  

	$(".table_title h2:first").click();
	
	if($(".table_title h2").length ==1){
		$(".table_title h2").unbind("click");
	}
   
    $(".sub_tool a.toggle_expand").click(function () {
        $(this).parents(".table_title").siblings(".table_title").removeClass("current");
        $(this).parents(".table_title").siblings(".table_title").find(".toggle_expand").removeClass("current");
        $(this).toggleClass("current");
        $(this).parents(".table_title").toggleClass("current");
        $(this).parents(".table_title").siblings().next(".table_details").slideUp(300);
        $(this).parents(".table_title").next(".table_details").stop().slideToggle(300);
        if (typeof (afterTitleExpand) != "undefined") {
            afterTitleExpand($(this).parent().next("h2"));
        }
        return false;
    });
    
    if($(".table_title h2").length==1){
    	$(".sub_tool a.toggle_expand").unbind("click");
	}

    //List页面有高级搜索
    //$(".big_title h2 a").parents(".big_title").next(".advanced_search").next(".main_con").toggleClass("main_con_expand");
    //详细页面无高级搜索
    $(".big_title").next(".main_con").toggleClass("main_con_expand");
    $(".big_title h2 a").toggleClass("expand");
    $(".big_title h2 a").click(function () {
        $(this).toggleClass("expand");
        $(this).parents(".big_title").next(".advanced_search").stop().slideToggle(200);
        $(this).parents(".big_title").next(".advanced_search").next(".main_con").toggleClass("main_con_expand");
    });

    var section_cons = $(".table_details .section_cons .con");
    section_cons.hide().filter(":first").show();

    $("ul.section_nav li a").click(function () {
        section_cons.hide();
        section_cons.filter(this.hash).show();
        $("ul.section_nav li").removeClass("active");
        $(this).parent("li").addClass("active");
        return false;
    });

    $("ul.section_nav li a:first").click();
    
    $(".text_input,.text_input_02,textarea").focus(function () {
        $(this).css("border-color", "#b8babb");
    });
    $(".text_input,.text_input_02,textarea").blur(function () {
        /*validatebox验证不通过下边框样式设置 zhengkai 2014-9-24*/
        if (typeof ($(this).attr('class')) != "undefined") {
        if ($(this).attr('class').indexOf("validatebox-invalid") > 0) {
            $(this).css("border-color", "#ffa8a8");
        }
        else {
            $(this).css("border-color", "#d8dcde");
        }
	}
    });
   
    //easyui-validatebox 在js赋值后调用 $.parser.parse($('#cc'));去掉cc中元素的红色边框
    $.parser.onComplete = function (context) {
        if (context != undefined && context.selector != undefined && context.selector != "") {
            $(context.selector).find(".easyui-validatebox").each(function () {
                if ($(this).attr('class').indexOf("validatebox-invalid") < 0) {
                    $(this).css("border-color", "#d8dcde");
                } else{
      			  $(this).css("border-color", "#ffa8a8");
                }
            });
        }

        $("textarea").each(function(index,element){
	   		 if (isBlank($(this).attr('class')) || $(this).attr('class').indexOf("validatebox-invalid") < 0) {
	                $(this).css("border-color", "#d8dcde");
	         } else{
	   			  $(this).css("border-color", "#ffa8a8");
	   		 }
        });
    }

    if($("textarea").length>0){
    	$.parser.parse($("textarea").parent());
    }
  
    
    $(".work_flow_bar li > a").hover(function () {
        $(this).next("dl").show();
        $(this).parent("li").siblings("li").children("dl").hide();
        /*$(this).addClass("active")*/
    });
    
    $(".jd_work_flow_bar li > a").unbind();
	
	$(".jd_work_flow_bar li dl > a,.jd_work_flow_bar li > a").click( function(){
		                                               $(".jd_work_flow_bar li").removeClass("finished");
													   $(this).parents("li").addClass("finished");
													   });

    $(".table_list tr").hover(function () {
        $(this).find(".handle_bar").stop().fadeIn(200);
        $(this).addClass("current");
    }, function () {
        $(this).find(".handle_bar").stop().fadeOut(200);
        $(this).removeClass("current");
    });

    $(".input_btn,.upload_btn").click(function () {
        $(".big_div").show();
    });

    $("#jsdw_btn").click(function () {
        $(".pop_div").css({ "top": "40%" });
        $("#jsdw_list").show().stop().animate({ top: "50%", opacity: "1" }, "0.2");
    });

    $(".upload_btn").click(function () {
        $(".pop_div").css({ "top": "40%" });
        $("#upload_list").show().stop().animate({ top: "50%", opacity: "1" }, "0.2");
    });

    $(".pop_close").click(function () {
        $(".pop_div").stop().animate({ top: "40%", opacity: "0" }, "0.2", function () {
            $(this).hide();
        });
        $(".big_div").hide();
    });
    $(".work_flow_bar li").filter(":last").css({ "background": "none", "min-width": "80px", "width": "8%" });

//var booking_div='<div class="booking_div"><h3>标题</h3><p><span class="booking_btn">预约</span><span class="approve_btn">审核</span><span class="booking_btn">解锁</span><span class="locked_btn">锁定</span></p></div>';
//					   
//			$(".td_free").hover(function(){
//											 $(this).append(booking_div);					 
//											 },function(){
//												 $(".booking_div").remove();
//												 });
			
  //禁用input 回车键事件
    document.onkeydown = function(event) {  
        var target, code, tag;  
        if (!event) {  
            event = window.event; //针对ie浏览器  
            target = event.srcElement;  
            code = event.keyCode;  
            if (code == 13) {  
                tag = target.tagName;  
                if (tag == "TEXTAREA") { return true; }  
                else { return false; }  
            }  
        } else {  
            target = event.target; //针对遵循w3c标准的浏览器，如Firefox  
            code = event.keyCode;  
            if (code == 13) {  
                tag = target.tagName;  
                if (tag == "INPUT") { return false; }  
                else { return true; }  
            }  
        }  
    }; 

});

//动态添加段落后的调整
function afterAddSectiion(titleid,detailid) {
    $("#" + titleid + " h2").click(function () {
        $(this).parent().siblings(".table_title").removeClass("current");
        $(this).parent().siblings(".table_title").find(".toggle_expand").removeClass("current");
        $(this).parent(".table_title").toggleClass("current");
        $(this).prev().children(".toggle_expand").toggleClass("current");
        $(this).parent().siblings(".table_title").next(".table_details").slideUp(300);
        $(this).parent(".table_title").next(".table_details").stop().slideToggle(300);
        if (typeof (afterTitleExpand) != "undefined") {
            afterTitleExpand($(this));
        }
        return false;
    });


    $("#" + titleid + " .sub_tool a.toggle_expand").click(function () {
        $(this).parents(".table_title").siblings(".table_title").removeClass("current");
        $(this).parents(".table_title").siblings(".table_title").find(".toggle_expand").removeClass("current");
        $(this).toggleClass("current");
        $(this).parents(".table_title").toggleClass("current");
        $(this).parents(".table_title").siblings().next(".table_details").slideUp(300);
        $(this).parents(".table_title").next(".table_details").stop().slideToggle(300);
        if (typeof (afterTitleExpand) != "undefined") {
            afterTitleExpand($(this));
        }
        return false;
    });

    $("#" + titleid + " .big_title h2 a").click(function () {
        $(this).toggleClass("expand");
        $(this).parents(".big_title").next(".advanced_search").stop().slideToggle(200);
        $(this).parents(".big_title").next(".advanced_search").next(".main_con").toggleClass("main_con_expand");
    });

    var section_cons = $("#" + detailid + " .section_cons .con");
    section_cons.hide().filter(":first").show();

    $("#" + detailid + " ul.section_nav li a").click(function () {
        section_cons.hide();
        section_cons.filter(this.hash).show();
        $("ul.section_nav li").removeClass("active");
        $(this).parent("li").addClass("active");
        return false;
    });

    $("#" + detailid + " .text_input," + "#" + detailid + " .text_input_02").focus(function () {
        $(this).css("border-color", "#b8babb");
    });

    $("#" + detailid + " .text_input," + "#" + detailid + " .text_input_02").blur(function () {
        /*validatebox验证不通过下边框样式设置 zhengkai 2014-9-24*/
        if ($(this).attr('class').indexOf("validatebox-invalid") > 0) {
            $(this).css("border-color", "#ffa8a8");
        }
        else {
            $(this).css("border-color", "#d8dcde");
        }
    });

    $.parser.parse('#' + detailid);
}


//easyui datagrid按百分比获取宽度 percent百分比（ 用小数）   hasNumCol 是否有序号列
function getWidth(percent, hasNumCol) {
    if (hasNumCol == undefined) {
        return ($(".datagrid-wrap").width() - 30) * percent; //30是有序号列所占的宽度
       
    }
    return ($(".datagrid-wrap").width()) * percent;//30是有序号列所占的宽度

}

//easyui datebox按百分比获取宽度 percent百分比 parentid父节点的id minwidth设置最小宽度 
function getDateboxWidth(percent, parentid,minwidth) {
    var w = $("#" + parentid).width() * percent + 8;
    if (minwidth!=undefined) {
        if (w < minwidth) {
            return minwidth; //美工设计的文本框text_input最小宽度是240
        }
    }
    return w;
}


//easyui datagrid行 鼠标放上去效果
function addHover() {
	$(".datagrid-btable tr").hover(function() {
		//$(this).find(".handle_bar").stop().fadeIn(200);
		//$(this).addClass("current");
	 	var index = $(this).attr("datagrid-row-index");
        	//$(this).parents('.datagrid-view').find(".datagrid-btable tr[datagrid-row-index='" + index + "']").find(".handle_bar").stop().fadeIn(200);
        	$(this).parents('.datagrid-view').find(".datagrid-btable tr[datagrid-row-index='" + index + "']").find(".handle_bar_new").stop().fadeIn(200);
        	$(this).parents('.datagrid-view').find(".datagrid-btable tr[datagrid-row-index='" + index + "']").addClass("current");
	}, function() {
		//$(this).find(".handle_bar").stop().fadeOut(200);
		//$(this).removeClass("current");
		 var index = $(this).attr("datagrid-row-index");
        	//$(this).parents('.datagrid-view').find(".datagrid-btable tr[datagrid-row-index='" + index + "']").find(".handle_bar").stop().fadeOut(200);
        	$(this).parents('.datagrid-view').find(".datagrid-btable tr[datagrid-row-index='" + index + "']").find(".handle_bar_new").stop().fadeOut(200);
        	$(this).parents('.datagrid-view').find(".datagrid-btable tr[datagrid-row-index='" + index + "']").removeClass("current");
	});
}


//无数据显示
function NodataDisplay(obj){
	var body = obj.data().datagrid.dc.body2;
	body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 25px; text-align: center;">没有数据</td></tr>');
}


//调整treegrid样式 id为treegrid的控件id,flag为标记参数 可选 "list" "detail" "detailtd",loadSuccessFunc
//	onloadsuccess expandFunc  collapseFunc 对应的回调方法
function adjustTreeGrid(id,flag,loadSuccessFunc,expandFunc,collapseFunc){//flag的值有list（列表页）  detail（详情页） detailtd(详情页td)
flag=flag.toLowerCase();
$("#"+id).treegrid({
	onLoadSuccess: function(row,data){
		//淡入淡出效果
		
		$(".datagrid-btable .datagrid-row").hover(function() {
			$(this).find(".handle_bar").stop().fadeIn(200);
			$(this).find(".handle_bar_new").stop().fadeIn(200);
			$(this).addClass("current");
		}, function() {
			$(this).find(".handle_bar").stop().fadeOut(200);
			$(this).find(".handle_bar_new").stop().fadeOut(200);
			$(this).removeClass("current");
		});    		
		
		//样式调整
		$(".treegrid-tr-tree td:first").css("padding", "0px");
		$(".treegrid-tr-tree").find("td:first").css("padding","0px");
		if(flag=="detail"||flag=="list"){//目前list和detail一样
    		$(".treegrid-tr-tree div:hidden").parent().css("height","0px");
    		//$(".datagrid-btable .tree-title").parents("td").css("padding","0px"); 
		}
		else if(flag=="detailtd"){
			$(".treegrid-tr-tree div:hidden").parent().css("height", "35px");
			$(".datagrid-td-rownumber").css("padding","0px 5px 0px 5px");
		}
		
		if(data.length==0){
			NodataDisplay($(this));//无数据显示
		}
		
  		//级联check
        	var target = $(this);
        	var opts = $.data(this, "treegrid").options;
        	
        	var panel = $(this).datagrid("getPanel");
        	
        	var gridBody = panel.find("div.datagrid-body");
        	
        	var idField = opts.idField;//这里的idField其实就是API里方法的id参数  
        	
        	gridBody.find("div.datagrid-cell-check input[type=checkbox]").unbind(".treegrid").click(function (e) {
        		
        		if (opts.singleSelect) return;//单选不管  
           		//checkbox方法
        		if(opts.checkChildren == false){
           			
           			var id = $(this).parent().parent().parent().attr("node-id");
               		if ($(this).length>0&&$(this)[0].checked){//选中状态
               			check(id);
               			checkParent(target, id, idField, status,opts.checkChildren);
               		}else{
               			unCheck(id);
               		}
           		}
            	if (opts.cascadeCheck || opts.deepCascadeCheck) {
            		
                	var id = $(this).parent().parent().parent().attr("node-id");
                	var status = false;
                	if ($(this).length>0&&$(this)[0].checked)status = true;
                	//级联选择父节点  
                	selectParent(target, id, idField, status,opts.checkChildren);
                	//级联选择子节点,设置是否级联子节点
                	//if(opts.checkChildren)
                	selectChildren(target, id, idField, opts.deepCascadeCheck, status,opts.checkChildren);
            	}
            	e.stopPropagation();//停止事件传播  
        	});
        	
		//回调事件
   		 if (loadSuccessFunc!=null&&(typeof (loadSuccessFunc) != "undefined")) {
   			loadSuccessFunc();
   	     }

            //下面是针对默认都是折叠起来的情况处理
            $(".treegrid-tr-tree div:hidden").parent().css("height", "0px");
            $("#" + id).treegrid("resize");

	},
	onExpand: function(row,data){
		if(flag=="detail"||flag=="list"){//目前list和detail一样
		$(".treegrid-tr-tree div:visible").parent().css("height","37px");//.datagrid-btable td 是37
		}
		else if(flag=="detailtd"){
		$(".treegrid-tr-tree div:visible").parent().css("height", "35px");
		}
		
		//回调事件
   		 if (expandFunc!=null&&(typeof (expandFunc) != "undefined")) {
   			expandFunc();
   	     }
		$("#"+id).treegrid("resize");
	},
	onCollapse: function(row,data){
		$(".treegrid-tr-tree div:hidden").parent().css("height","0px");
		//回调事件
   		 if (collapseFunc!=null&&(typeof (collapseFunc) != "undefined")) {
   			collapseFunc();
   	     }

		$("#"+id).treegrid("resize");
	}
});
}

function treeGridOnLoadSuccess(row,data,flag,id){
	//淡入淡出效果
	$(".datagrid-btable .datagrid-row").hover(function() {
		$(this).find(".handle_bar").stop().fadeIn(200);
		$(this).find(".handle_bar_new").stop().fadeIn(200);
		$(this).addClass("current");
	}, function() {
		$(this).find(".handle_bar").stop().fadeOut(200);
		$(this).find(".handle_bar_new").stop().fadeOut(200);
		$(this).removeClass("current");
	});    		
	
	//样式调整
	$(".treegrid-tr-tree td:first").css("padding", "0px");
	$(".treegrid-tr-tree").find("td:first").css("padding","0px");
	if(flag=="detail"||flag=="list"){//目前list和detail一样
		$(".treegrid-tr-tree div:hidden").parent().css("height","0px");
		//$(".datagrid-btable .tree-title").parents("td").css("padding","0px"); 
	}
	else if(flag=="detailtd"){
		$(".treegrid-tr-tree div:hidden").parent().css("height", "35px");
		$(".datagrid-td-rownumber").css("padding","0px 5px 0px 5px");
	}
	
	if(data.length==0){
		NodataDisplay($(this));//无数据显示
	}
	
	//下面是针对默认都是折叠起来的情况处理
    $(".treegrid-tr-tree div:hidden").parent().css("height", "0px");
    $("#" + id).treegrid("resize");
}

function treeGridOnExpand(row,data,flag,id){
	if(flag=="detail"||flag=="list"){//目前list和detail一样
	$(".treegrid-tr-tree div:visible").parent().css("height","37px");//.datagrid-btable td 是37
	}
	else if(flag=="detailtd"){
	$(".treegrid-tr-tree div:visible").parent().css("height", "35px");
	}
	$("#"+id).treegrid("resize");
}

function treeGridOnCollapse(row,data,flag,id){
	$(".treegrid-tr-tree div:hidden").parent().css("height","0px");
	$("#"+id).treegrid("resize");
}

/** 
 * treegrid级联选择父节点 
 * @param {Object} target 
 * @param {Object} id 节点ID 
 * @param {Object} status 节点状态，true:勾选，false:未勾选，status2:status2：勾选级联，取消勾选不级联
 * @return {TypeName}  
 */
function selectParent(target, id, idField, status,status2) {
	var status2=true;
    var parent = target.treegrid('getParent', id);
    if (parent) {
        var parentId = parent[idField];
        if (status){
        	target.treegrid('select',id);
            target.treegrid('select', parentId);
            selectParent(target, parentId, idField, status);
        }
        else{
        	target.treegrid('unselect',id);
        }
        
    }
}
function checkParent(target, id, idField, status) {
    var parent = target.treegrid('getParent', id);
    if (parent) {
        var parentId = parent[idField];
        if (true){
        	 check(parentId,2);
            checkParent(target, parentId, idField, status);
        }
    }
}
/** 
 * treegrid级联选择子节点 
 * @param {Object} target 
 * @param {Object} id 节点ID 
 * @param {Object} deepCascade 是否深度级联 
 * @param {Object} status 节点状态，true:勾选，false:未勾选，status2：勾选不级联，取消勾选级联
 * @return {TypeName}  
 */
function selectChildren(target, id, idField, deepCascade, status,status2) {
    //深度级联时先展开节点  
    if (status && deepCascade)
        target.treegrid('expand', id);
    //根据ID获取下层孩子节点  
    var children = target.treegrid('getChildren', id);
    for (var i = 0; i < children.length; i++) {
        var childId = children[i][idField];
        if (status==true&&status2==true)
            target.treegrid('select', childId);
        else
            target.treegrid('unselect', childId);
        selectChildren(target, childId, idField, deepCascade, status);//递归选择子节点  
    }
}
function cascadeCheck(id){
	//级联check
	var target = $("#"+id);
	if($.data(target[0], "treegrid")!=undefined){
	var opts = $.data(target[0], "treegrid").options;
	
	var panel = target.datagrid("getPanel");
	
	var gridBody = panel.find("div.datagrid-body");
	
	var idField = opts.idField;//这里的idField其实就是API里方法的id参数  
	
	gridBody.find("div.datagrid-cell-check input[type=checkbox]").unbind(".treegrid").click(function (e) {
		
		if (opts.singleSelect) return;//单选不管  
   		//checkbox方法
		if(opts.checkChildren == false){
   			
   			var id = $(this).parent().parent().parent().attr("node-id");
       		if ($(this).length>0&&$(this)[0].checked){//选中状态
       			check(id);
       			checkParent(target, id, idField, status,opts.checkChildren);
       		}else{
       			unCheck(id);
       		}
   		}
    	if (opts.cascadeCheck || opts.deepCascadeCheck) {
    		
        	var id = $(this).parent().parent().parent().attr("node-id");
        	var status = false;
        	if ($(this).length>0&&$(this)[0].checked)status = true;
        	//级联选择父节点  
        	selectParent(target, id, idField, status,opts.checkChildren);
        	//级联选择子节点,设置是否级联子节点
        	//if(opts.checkChildren)
        	selectChildren(target, id, idField, opts.deepCascadeCheck, status,opts.checkChildren);
    	}
    	e.stopPropagation();//停止事件传播  
	});
	}
}


