﻿/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//新版
//文件是否存在验证路径
var fileIsExits = fileHttpPre+'/checkFileIsExist';
//非断点文件上传路径
var newFileUpLoad = fileHttpPre+'/uploader.html';
//非断点文件上传路径(验签解压)
var newFileUpLoad2 = fileHttpPre+'/uploader2.html';
//招标文件上传
var newFileUploadZbwj = fileHttpPre+'/uploaderZbwj.html';
//招标清单文件上传(验签解压并检查商务标文件与控制价文件的一致性)
var newFileUploadZbqd = fileHttpPre+'/uploaderZbqd.html';
//文件下载路径
var fileDownLoad = fileHttpPre+'/downloadFile';
var newFileDownLoad = fileHttpPre+'/downloadFile';
//解密后文件
var newDecFileDownload = fileHttpPre+'/downloadDecFile';
//断点文件上传
var brokenFileUpLoad = fileHttpPre+'/brokenUploader.html';

//文件撤销路径
var removeFile = fileHttpPre+'/removeFile';
//跨域回调ifream路径 ，这个是招标系统的

var zbCrossDomain = zbHttpPre+'/crossDomain.html';
var tbCrossDomain = tbHttpPre+'/crossDomain.html';
var fwCrossDomain = fwHttpPre+'/crossDomain.html';
var jgCrossDomain = jgHttpPre+'/crossDomain.html';
var centerCrossDomain = centerHttpPre+'/crossDomain.html';

var pdfGuiDangQianMing = fileHttpPre+'/pdf/qianming_guidang.html';
var zbPdfCrossDomain =  zbHttpPre+'/pdfCrossDomain.html';
var tbPdfCrossDomain = tbHttpPre+'/pdfCrossDomain.html';
var fwPdfCrossDomain = fwHttpPre+'/pdfCrossDomain.html';
var jgPdfCrossDomain = jgHttpPre+'/pdfCrossDomain.html';
var centerPdfCrossDomain = centerHttpPre+'/pdfCrossDomain.html';
var jgUrl = jgHttpPre;
var fwUrl = fwHttpPre;

var pdfPath = fileHttpPre+'/pdf/pdf2swfviewer.html';
//将一个表单的数据返回成JSON对象 
$.fn.serializeObject = function() {	
  var o = {};  
  var a = this.serializeArray();  
  $.each(a, function() {  
    if (o[this.name]) {  
      if (!o[this.name].push) {  
        o[this.name] = [ o[this.name] ];  
      }  
      o[this.name].push(this.value || '');  
    } else {  
      o[this.name] = this.value || '';  
    }  
  });  
  return o;  
};  

function showTitle(val,row,index){
	return '<span title='+dealNull(val)+'>'+dealNull(val)+'</span>';
}

(function($) {
    $.fn.serializeJson = function(prefix) {
        var result = {};
        var n = prefix ? (prefix + '.') : "";
        var arrayTypes = this["arrayTypes"];
        var array = this.serializeArray();
        var datetimeTypes = this["datetimeTypes"] || [];
        for (var i = 0; i < array.length; i++) {
            if ($.inArray(array[i].name, datetimeTypes) >= 0) {
                if (array[i].value) {
                    array[i].value = new Date(array[i].value.replace(/-/g, "/")).getTime();
                } else {
                    delete array[i].name;
                }
            }
        }
        $(array).each(function() {
            if (!this.name || this.name.indexOf(n) != 0) return;
            var name = this.name.substring(n.length);
            var idot = name.indexOf('.');
            if (idot > 0) {
                var n1 = name.substring(0, idot);
                var n2 = name.substring(idot + 1);
                if (!result[n1]) result[n1] = {};
                result[n1][n2] = this.value;
            } else if (result[name]) {
                if ($.isArray(result[name])) {
                    result[name].push(this.value);
                } else {
                    result[name] = [result[name], this.value];
                }
            } else {
                result[name] = this.value;
            }
        });
        if (!arrayTypes) return result;
        for (var i = 0; i < arrayTypes.length; i++) {
            var n = arrayTypes[i];
            if (!result[n]) {
                delete result[n];
            } else if (!$.isArray(result[n])) {
                result[n] = [result[n]];
            }
        }
        return result;
    };

    var privateJsonString = function(object) {
        var type = typeof object;
        if ('object' == type && Array == object.constructor) {
            type = 'array';
        }
        switch (type) {
            case 'number':
                return object ? ("" + object) : "0";
            case 'string':
                return '"' + object.replace(/(\\|\")/g, "\\$1") + '"';
            case 'object':
                var results = [];
                for (var property in object) {
                    results.push(property + ':' + privateJsonString(object[property]));
                }
                return '{' + results.join(',') + '}';
            case 'array':
                var results = [];
                for (var i = 0; i < object.length; i++) {
                    results.push(object[i] ? privateJsonString(object[i]) : "null");
                }
                return '[' + results.join(',') + ']';
            default :
                return (object === undefined) ? ("" + object) : "null";
        }
    };
    $.objectToString = privateJsonString;
    $.fn.serializeJsonString = function(prefix) {
        return privateJsonString(this.serializeJson(prefix));
    };

})(jQuery);

$.extend($.fn.panel.defaults, {
    loadingMessage: '加载中....'
});

$.extend($.fn.datagrid.defaults, {
    loadMsg: '数据加载中....'
});
$.extend($.fn.datagrid.defaults.view, {
	renderRow: function(target, fields, frozen, rowIndex, rowData) {
		var opts = $.data(target, 'datagrid').options;

		var cc = [];
		if (frozen && opts.rownumbers) {
			var rownumber = rowIndex + 1;
			if (opts.pagination) {
				rownumber += (opts.pageNumber - 1) * opts.pageSize;
			}
			cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">' + rownumber + '</div></td>');
		}
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			var col = $(target).datagrid('getColumnOption', field);
			if (col) {
				//start 处理多级数据
                var fieldSp = field.split(".");
                var dta = rowData[fieldSp[0]];
                for (var j = 1; j < fieldSp.length; j++) {
                    dta = dta[fieldSp[j]];
                }
                //end 处理多级数据
				// get the cell style attribute
				var styleValue = col.styler ? (col.styler(dta, rowData, rowIndex) || '') : '';
				var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');

				cc.push('<td field="' + field + '" ' + style + '>');

				if (col.checkbox) {
					var style = '';
				} else {
					var style = '';
					//var style = 'width:' + (col.boxWidth) + 'px;';
					style += 'text-align:' + (col.align || 'left') + ';';
					if (!opts.nowrap) {
						style += 'white-space:normal;height:auto;';
					} else if (opts.autoRowHeight) {
						style += 'height:auto;';
					}
				}

				cc.push('<div style="' + style + '" ');
				if (col.checkbox) {
					cc.push('class="datagrid-cell-check ');
				} else {
					cc.push('class="datagrid-cell ' + col.cellClass);
				}
				cc.push('">');

				if (col.checkbox) {
					cc.push('<input type="checkbox" name="' + field + '" value="' + (dta != undefined ? dta : '') + '"/>');
				} else if (col.formatter) {
					cc.push(col.formatter(dta, rowData, rowIndex));
				} else {
					cc.push(dta);
				}

				cc.push('</div>');
				cc.push('</td>');
			}
		}
		return cc.join('');
	}
});
$.extend($.fn.datagrid.defaults, {
	method:'POST',
    striped: true, //设置为true将交替显示行背景。
    rownumbers: true, //设置为true将显示行数。
    pagination: true,
    singleSelect: true,
    checkOnSelect: true,
    selectOnCheck: true,
    fitColumns: true,
    pageSize: 10,
    pageList: [5,10,15],
    emptyMsg: '没有相关数据!',
    loadMsg: '数据加载中……',
    onLoadSuccess:function(data){
    	/*if(data.total == 0){
			NodataDisplay($(this));//无数据显示
		}*/
		addHover();
    }
});

/**
 * ajax 默认公共属性
 */
$.ajaxSetup({
	  cache: false,
	  async: false
	});

/**
 * ajax扩展方法
 * @param url 请求地址
 * @param data 参数data
 * @param successFn 成功的回调函数
 * @param fnParam
 * @param type 提示类型（alert还是show）
 * @param msg 消息体
 * @param title 标题
 */
function ajaxExpand(url, data, successFn, fnParam, type, msg, title){
	//设置全局ajax参数
	$.ajax({
		cache:false,//不缓存页面
		async:false,//同步请求
		type : 'POST',//请求方式
		contentType : 'application/json',//内容编码类型
		url:url,
		data:data,
		dataType : 'json',//服务器返回的数据类型：json
		success : function(data) {//成功回调的函数
			if(data.code) return;
			if(isNotBlank(type) && type == "show"){
				 showMessage(msg, title);
			}else if(isNotBlank(type) && type == "alert"){
				alertMessage(msg , title, null, successFn, fnParam);
			}else{
				showMessage(msg, title);
			}
		},
		error:function(){
			alertMessage("请求失败");
		}
	});
}

$.extend($.fn.pagination.defaults, {
    layout: ['list', 'first', 'prev', 'next', 'last', 'sep', 'links', 'sep', 'manual','refresh'],
	beforePageText: '跳转到',
    afterPageText: '页',
    displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
});

function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

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


//根据单选按钮值设置html元素是否可见
function changeView(name,eleId,value,eleId2,value2,eleId3,value3){
	var str = 'input[name="'+name+'"]:checked';
	var radioValueTmp = $(str).val();
	var radioValue = ","+ radioValueTmp +",";
	if(value.indexOf(radioValue) >= 0)
		$('#'+eleId).show();
	else
		$('#'+eleId).hide();
	
	if(!value2) return;
	if(value2.indexOf(radioValue) >= 0)
		$('#'+eleId2).show();
	else
		$('#'+eleId2).hide();
	
	if(!value3) return;
	if(value3.indexOf(radioValue) >= 0)
		$('#'+eleId3).show();
	else
		$('#'+eleId3).hide();
	
}

//根据下拉列表框值设置html元素是否可见
function changeSelView(selId,eleId,value,eleId2,value2,eleId3,value3){
	var selValueTmp = $("#"+selId).val();
	var selValue = ","+ selValueTmp +",";
	if(value.indexOf(selValue) >= 0)
		$('#'+eleId).show();
	else
		$('#'+eleId).hide();
	
	if(!value2) return;
	if(value2.indexOf(selValue) >= 0)
		$('#'+eleId2).show();
	else
		$('#'+eleId2).hide();
	
	if(!value3) return;
	if(value3.indexOf(selValue) >= 0)
		$('#'+eleId3).show();
	else
		$('#'+eleId3).hide();
	
}

/**
 * 取出id为selId的下拉框的文本赋给id为inputId的文本框
 * @param selId
 * @param inputId
 */
function findSelToInput(selId, inputId){
	var checkVal = $("#"+selId).val();
	if(checkVal && checkVal != "-1")
		$("#"+inputId).val($("#"+selId).find("option:selected").text());
	else
		$("#"+inputId).val("");
}

/**
 * 取出id为selId的下拉框的文本赋给id为spanId的span元素
 * @param selId
 * @param spanId
 */
function findSelToSpan(selId, spanId){
	var checkVal = $("#"+selId).val();
	if(checkVal && checkVal != "-1")
		$("#"+spanId).text($("#"+selId).find("option:selected").text());
	else
		$("#"+spanId).text("");
}

/**
 * 获取名称为name的radio元素的当前选中值，如果当前选中的值为value,则置name的radio元素为可用状态，否则为不可用
 * @param name
 * @param value
 * @param disName
 */
function chgDisable(name,value,disName){
	var value = $("input[name="+name+"]:checked").val();
	var flag = true;
	if(value == "1")
		flag = false;
	else 
		flag = true;
	var objs = $("input[name="+disName+"]");
	for(var i=0;i<objs.length;i++){
		objs[i].disabled  = flag;
	}
}

//如果sleId的值为value，则selId2不可用
function chgSelDisable(selId,value,selId2){
	var selValue = $("#"+selId).val();
	var flag = true;
	if(selValue == value)
		flag = false;
	else 
		flag = true;
	$("#"+selId2).attr("disabled",flag);
}

/**
 * 格式化日期 
 * 调用方式： var str = new Date().Format("yyyy-MM-dd HH:mm:ss");
 */
Date.prototype.Format = function (fmt) { //author: meizz  
    var o = { 
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "H+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒  
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
        "S": this.getMilliseconds() //毫秒  
    }; 
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
    for (var k in o) 
        if (new RegExp("(" + k + ")").test(fmt)) 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
    return fmt; 
} ;
/*
 * 出现类型未定义请使用下面方法
 *  调用方式：
 */
function dateFormat(date,fmt){
	var o = { 
	        "M+": date.getMonth() + 1, //月份  
	        "d+": date.getDate(), //日  
	        "H+": date.getHours(), //小时  
	        "m+": date.getMinutes(), //分  
	        "s+": date.getSeconds(), //秒  
	        "q+": Math.floor((date.getMonth() + 3) / 3), //季度  
	        "S": date.getMilliseconds() //毫秒  
	    }; 
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length)); 
	    for (var k in o) 
	        if (new RegExp("(" + k + ")").test(fmt)) 
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
	    return fmt; 	
}

/**
 * 字符串转日期
 * 格式：yyyy-MM-dd HH:mm:ss
 *     yyyy-MM-dd
 * @param strDate
 * @returns {Date}
 */
function strToDate(strDate){
	if(!strDate) return;
	var o = new Date(strDate.replace(/-/g,"/"));
	return o;
	
}

//修改baseObj对象中name字段的日期时间格式值为long型
function chgDateToLong(baseObj,name){
	if(baseObj[name] && baseObj[name]!="")
		baseObj[name] = strToDate(baseObj[name]).getTime();
	else
		baseObj[name] = "";
}

//修改bean对象中name字段的long时间格式值为format格式的日期
function chgLongToDateStr(bean, name, format){
	//var time1 = new Date().Format("yyyy-MM-dd"); 
	//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
	if(bean[name] && bean[name]!="")
		bean[name] = new Date(bean[name]).Format(format);
	else
		bean[name] = "";
}
//修改bean对象中name字段的long时间格式值为format格式的日期(备用)
function changeDate(bean, name, format){
	
	if(bean[name] && bean[name]!="")
		bean[name] = dateFormat(new Date(bean[name]),format);
	else
		bean[name] = "";
}


//加法函数  
function accAdd(arg1, arg2) {  
    var r1, r2, m;  
    try {  
        r1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r1 = 0;  
    }  
    try {  
        r2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r2 = 0;  
    }  
    m = Math.pow(10, Math.max(r1, r2));  
    return (arg1 * m + arg2 * m) / m;  
}   
//给Number类型增加一个add方法，，使用时直接用 .add 即可完成计算。   
Number.prototype.add = function (arg) {  
    return accAdd(arg, this);  
};  
  
//减法函数  
function Subtr(arg1, arg2) {  
    var r1, r2, m, n;  
    try {  
        r1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r1 = 0;  
    }  
    try {  
        r2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r2 = 0;  
    }  
    m = Math.pow(10, Math.max(r1, r2));  
     //last modify by deeka  
     //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;  
    return ((arg1 * m - arg2 * m) / m).toFixed(n);  
}  
  
//给Number类型增加一个add方法，，使用时直接用 .sub 即可完成计算。   
Number.prototype.sub = function (arg) {  
    return Subtr(this, arg);  
};  
  
//乘法函数  
function accMul(arg1, arg2) {  
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
    try {  
        m += s1.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        m += s2.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
}   
//给Number类型增加一个mul方法，使用时直接用 .mul 即可完成计算。   
Number.prototype.mul = function (arg) {  
    return accMul(arg, this);  
};   
  
//除法函数  
function accDiv(arg1, arg2) {  
    var t1 = 0, t2 = 0, r1, r2;  
    try {  
        t1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        t2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    with (Math) {  
        r1 = Number(arg1.toString().replace(".", ""));  
        r2 = Number(arg2.toString().replace(".", ""));  
        return (r1 / r2) * pow(10, t2 - t1);  
    }  
}   
//给Number类型增加一个div方法，，使用时直接用 .div 即可完成计算。   
Number.prototype.div = function (arg) {  
    return accDiv(this, arg);  
}; 

//强制保留两位小数
function changeTwoDecimal(x, decCount)
{
    var tmp1 = Number(100);
    var dextmp1 = 2;
    if(isNotBlank(decCount) && !isNaN(decCount)){
    	dextmp1 = decCount;
    	tmp1 = Number(1);
    	for(var decC=0;decC<decCount;decC++){
    		tmp1 = tmp1 * 10;
    	}
    }
	
	var f_x = parseFloat(x);
    if (isNaN(f_x))
    {
        return false;
    }
    f_x = Math.round(f_x*tmp1)/tmp1;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0)
    {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + dextmp1)
    {
        s_x += '0';
    }
    return s_x;
}

//扩大baseObj中name属性值为原来的level倍
function chgYToF(baseObj, name, level){
	if(baseObj[name] == 0) return;
	if(baseObj[name] && baseObj[name]!="")
		baseObj[name] = new Number(baseObj[name]).mul(level);
	else
		baseObj[name] = 0;
}

//缩小bean中name属性值为原来的level倍
function chgFToY(bean, name, level){
	if(bean[name] == 0) return;
	if(bean[name] && bean[name]!="")
		bean[name] = new Number(bean[name]).div(level);
	else
		bean[name] = "";
}

//格式化列表金额，单位从分转为元
function formaterListMoney(value, level){
	if(isBlank(value)) return "";
	if(isBlank(level)) return value;
	return new Number(value.div(level));
}

//1.弹出div 属性  class="pop_div" id="chooseData_list"
//2.加载div中表格 table_list的数据
function chooseData(type){

	$(".pop_div").css({"top":"40%"});
	$("#chooseData_list").show().stop().animate({top:"50%",opacity:"1"},"0.2");
	var dataTable = $('#table_list');
	if(type == "xmData"){//项目信息
		$("#chooseFlag").text("项目");
		getXiangMuInfo(dataTable); 
	}else if(type == 'JSDW'){
		$("#chooseFlag").text("建设单位");
		getJSDWInfo(dataTable);
	}else if(type == "zdXiangMu"){
		$("#chooseFlag").text("重大项目");
		getZDXiangMuInfo(dataTable); 
	}else if(type == "gcOverData"){
		$("#chooseFlag").text("工程");
		getOverGongChengInfo(dataTable); 
	}else if(type == "YQDWData"){
		$("#chooseFlag").text("邀请单位");
		getYQDWInfo(dataTable); 
	}
	   
}

//1.处理选中行的数据
//2.关闭div层  div 属性  class="pop_div" 
function closeChooseData(){
	var row = $('#table_list').datagrid('getSelected');
	var spanText = $("#chooseFlag").text();
	if(spanText == "项目"){//项目信息
		if(setXiangMuInfo(row) == false) return;
	}else if(spanText == "建设单位"){
		if(setJSDWInfo(row) == false) return;
	}else if(spanText == "重大项目"){
		if(setZDXiangMuInfo(row) == false) return;
	}else if(spanText == "工程"){
		if(setOverGongChengInfo(row) == false) return;
	}
	$(".pop_div").stop().animate({top:"40%",opacity:"0"},"0.2",function(){
		  $(this).hide();
	});
	$(".big_div").hide();
}



//获取对象类型
function getType(a){
	 return Object.prototype.toString.call(a);
}
//根据id设置元素的值
function setEleValue(id,value){
	if($("#"+id).length > 0){
		if($("#"+id).get(0).tagName === "SPAN"){
			if(value!=null){
				$("#"+id).text(value);
			}
		}else if($("#"+id).get(0).tagName === "SELECT"){
			$("#"+id).val(value);
		}else if($("#"+id).get(0).tagName === "TEXTAREA"){
			$("#"+id).val(value);
		}else if($("#"+id).get(0).tagName === "DIV"){
			$("#"+id).html(value);
		}else if($("#"+id).get(0).tagName === "LABEL"){
			$("#"+id).text(value);
		}else if($("#"+id).get(0).tagName === "INPUT"){
			$("#"+id).val(value);
		}
	}else if($("input[name="+id+"]").length >0){
		if($("input[name="+id+"]")[0].type == "radio"){
			$('input[type="radio"][name="'+id+'"][value='+value+']').prop("checked",'checked'); 
		}else if($("input[name="+id+"]")[0].type == "checkbox"){
			$('input[type="checkbox"][name="'+id+'"][value='+value+']').prop("checked",'checked'); 
		}
	}
}
//根据nObj中的属性设置html元素的值
function loadBeanValue(nObj){
	if(!nObj) return;
	var Obj = nObj;
	if(getType(Obj) === '[object String]')
		Obj = eval('('+nObj+')');
	
	for (pro in Obj){  
		if(getType(Obj[pro]) === '[object String]'){
	    	setEleValue(pro,Obj[pro]);
	    }else if(getType(Obj[pro]) === '[object Number]'){
	    	setEleValue(pro,Obj[pro]);
	    }else if(getType(Obj[pro]) === '[object Boolean]'){
	    	setEleValue(pro,Obj[pro]);
	    }else if(getType(Obj[pro]) === '[object Date]'){
	    	setEleValue(pro,Obj[pro].Format("yyyy-MM-dd HH:mm:ss"));
	    }else if(getType(Obj[pro]) === '[object Array]'){
	    	/*for(var i=0;i<Obj[pro].length;i++){
	    		setEleValue(pro,Obj[pro][i]);
	    	}*/
	    }else if(getType(Obj[pro]) === '[object Function]'){
	    	
	    }else if(getType(Obj[pro]) === '[object Object]'){
	    	//loadBeanValue(Obj[pro]);
	    }
	} 
}

//未定义字段处理
function dealNullAndUndefined(value){
	if(typeof(value) == "undefined") 
		return "";
	if(value == null)
		return "";
	if(value == "null")
		return "";
	if(value == "undefined")
		return "";
	return value;
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

//获得备案状态（枚举中的备案状态，包括预未提交、已提交、备案不通过及备案通过）
function getShenPiZhuangTaiColorText(val) {
	if(!isNotBlank(val)) return "";
	if(val == ShenPiZhuangTai.WEISHENPI) {
		return '未提交';
	}else if(val == ShenPiZhuangTai.YITIJIAOSHENPI) {
		return '<i style="font-style:normal;color:#1480dc;">已提交</i>';
	}else if(val == ShenPiZhuangTai.YUSHOULIDENY || val == ShenPiZhuangTai.SHOULIDENY || val == ShenPiZhuangTai.SHENPIDENY) {
		return '<em style="font-style:normal;color:#d8800e;font-weight:100;">备案不通过</em>';
	}else if(val == ShenPiZhuangTai.SHENPIPASS || val == ShenPiZhuangTai.FINISH) {
		return '<b style="font-style:normal;color:#3c8e0d; font-weight:100;">备案通过</b>';
	}else{
		return '<b style="font-style:normal;color:#1480dc; font-weight:100;">备案中</b>';
	}
	return "";
}

//获得审批状态（枚举中的审批状态，包括预未提交、已提交、审核不通过及审核通过）
function getShenPiZhuangTaiColorText2(val) {
	if(!isNotBlank(val)) return "";
	if(val == ShenPiZhuangTai.WEISHENPI) {
		return '未提交';
	}else if(val == ShenPiZhuangTai.YITIJIAOSHENPI) {
		return '<i style="font-style:normal;color:#1480dc;">已提交</i>';
	}else if(val == ShenPiZhuangTai.YUSHOULIDENY || val == ShenPiZhuangTai.SHOULIDENY || val == ShenPiZhuangTai.SHENPIDENY) {
		return '<em style="font-style:normal;color:#d8800e;font-weight:100;">审核不通过</em>';
	}else if(val == ShenPiZhuangTai.SHENPIPASS || val == ShenPiZhuangTai.FINISH) {
		return '<b style="font-style:normal;color:#3c8e0d; font-weight:100;">审核通过</b>';
	}else{
		return '<b style="font-style:normal;color:#1480dc; font-weight:100;">审核中</b>';
	}
	return "";
}

//获得备案状态（枚举中的备案状态，包括预受理、受理、备案等信息）
function getShenPiZhuangTaiText(val){
	if(!isNotBlank(val)) return "";
	return ShenPiZhuangTai[val];
}

//格式化输出状态列
function getGongChengLeiXingText(val) {
	if(!isNotBlank(val)) return "";
	return GongChengLeiXing[val];
}

//获得备案状态（包括预未提交、已提交、备案不通过及备案通过）
function formatShenPiZhuangTaiJY(val){
	return getShenPiZhuangTaiColorText(val);
}

//获得备案状态
function formatGongChengLeiXing(val){
	return getGongChengLeiXingText(val);
}

//根据类型格式化时间 val:long类型时间；formatType:需要格式化的样式字符串（如：yyyy-MM-dd HH:mm:ss等）
function formatDateByType(val, formatType){
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	if(isNotBlank(formatType)){
		return new Date(Number(val)).Format(formatType);		
	}else{
		return new Date(Number(val)).Format(DateFormat['DATETIME']);
	}
}

//格式化输出修改时间列(yyyy-MM-dd HH:mm:ss)
function formatToDateTimes(val) {
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	return new Date(Number(val)).Format(DateFormat.DATETIMES);
}

//格式化输出修改时间列(yyyy-MM-dd HH:mm)
function formatToDateTime(val) {
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	return new Date(Number(val)).Format(DateFormat.DATETIME);
}
//格式化输出修改时间列(yyyy-MM-dd)
function formatToDate(val) {
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	return new Date(Number(val)).Format(DateFormat.DATE);
}

//格式化输出修改时间列(HH:mm:ss)
function formatToTimes(val) {
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	return new Date(Number(val)).Format(DateFormat.TIMES);
}

//格式化输出修改时间列(HH:mm)
function formatToTime(val) {
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	return new Date(Number(val)).Format(DateFormat.TIME);
}

//格式化输出修改时间列(年月日)
function formatToDateTime3(val) {
	if(!isNotBlank(val)) return "";  //判断是否为空
	if(isNaN(val)) return "";  //判断是否为数字
	return new Date(Number(val)).Format(DateFormat.DATETIME3);
}
//格式化事项类型
function formatShiXiangLeiXing(val){
	if(!isNotBlank(val)) return "";  //判断是否为空
	return ShiXiangLeiXing[val];
}

//格式化审批流程中备注信息类型
function formatShenPiBeiZhu(val){
	var str = formatShenPiBeiZhuAll(val);
	return '<span title='+str+'>'+str+'</span>';
}

//格式化审批流程中备注信息类型
function formatShenPiBeiZhuAll(val){
	if(isBlank(val)) return "";  //判断是否为空
	var endIndex = val.indexOf("事项类型");
	if(endIndex > 0){
		return val.substr(0, endIndex-1);
	}else{
		return val;
	}
}

$.extend($.fn.form.methods, {
	myLoad : function (jq, param) {
		return jq.each(function () {
			load(this, param);
		});

		function load(target, param) {
			if (!$.data(target, "form")) {
				$.data(target, "form", {
					options : $.extend({}, $.fn.form.defaults)
				});
			}
			var options = $.data(target, "form").options;
			if (typeof param == "string") {
				var params = {};
				if (options.onBeforeLoad.call(target, params) == false) {
					return;
				}
				$.ajax({
					url : param,
					data : params,
					dataType : "json",
					success : function (rsp) {
						loadData(rsp);
					},
					error : function () {
						options.onLoadError.apply(target, arguments);
					}
				});
			} else {
				loadData(param);
			}
			function loadData(dd) {
				var form = $(target);
				var formFields = form.find("input[name],select[name],textarea[name]");
				formFields.each(function(){
					var name = this.name;
					var value = jQuery.proxy(function(){try{return eval('this.'+name);}catch(e){return "";}},dd)();
					var rr = setNormalVal(name,value);
					if (!rr.length) {
						var f = form.find("input[numberboxName=\"" + name + "\"]");
						if (f.length) {
							f.numberbox("setValue", value);
						} else {
							$("input[name=\"" + name + "\"]", form).val(value);
							$("textarea[name=\"" + name + "\"]", form).val(value);
							$("select[name=\"" + name + "\"]", form).val(value);
						}
					}
					setPlugsVal(name,value);
				});
				options.onLoadSuccess.call(target, dd);
				$(target).form("validate");
			};
			function setNormalVal(key, val) {
				var rr = $(target).find("input[name=\"" + key + "\"][type=radio], input[name=\"" + key + "\"][type=checkbox]");
				rr._propAttr("checked", false);
				rr.each(function () {
					var f = $(this);
					if (f.val() == String(val) || $.inArray(f.val(), val) >= 0) {
						f._propAttr("checked", true);
					}
				});
				return rr;
			};
			function setPlugsVal(key, val) {
				var form = $(target);
				var cc = ["combobox", "combotree", "combogrid", "datetimebox", "datebox", "combo"];
				var c = form.find("[comboName=\"" + key + "\"]");
				if (c.length) {
					for (var i = 0; i < cc.length; i++) {
						var combo = cc[i];
						if (c.hasClass(combo + "-f")) {
							if (c[combo]("options").multiple) {
								c[combo]("setValues", val);
							} else {
								c[combo]("setValue", val);
							}
							return;
						}
					}
				}
			};
		};
	}
});

//处理null及undefined
function dealNull(value){
	if(value == undefined || value == null){
		return "";
	}
	return value;
}

//根据nObj中的属性设置html元素的值
function delBlankElement(nObj){
	if(!nObj) return;
	var Obj = nObj;
	if(getType(Obj) === '[object String]')
		Obj = eval('('+nObj+')');
	
	for (pro in Obj){  
		if(getType(Obj[pro]) === '[object String]'){
			if(Obj[pro] == ""){
				delete Obj[pro];
			}
	    }else if(getType(Obj[pro]) === '[object Number]'){
	    	if(Obj[pro] == ""){
				delete Obj[pro];
			}
	    }else if(getType(Obj[pro]) === '[object Boolean]'){
	    	if(Obj[pro] == ""){
				delete Obj[pro];
			}
	    }else if(getType(Obj[pro]) === '[object Date]'){
	    	if(Obj[pro] == ""){
				delete Obj[pro];
			}
	    }else if(getType(Obj[pro]) === '[object Array]'){
	    	var num = Obj[pro].length;
	    	for(var i=0;i<num;i++){
	    		delBlankElement(Obj[pro][i]);
	    	}
	    }else if(getType(Obj[pro]) === '[object Function]'){
	    	
	    }else if(getType(Obj[pro]) === '[object Object]'){
	    	delBlankElement(Obj[pro]);
	    }
	} 
}
(function($) {
    $.fn.watch = function(callback) {
        return this.each(function() {
            //缓存以前的值
            $.data(this, 'originVal', $(this).val());

            //event
            $(this).on('keyup paste', function() {
                var originVal = $(this, 'originVal');
                var currentVal = $(this).val();

                if (originVal !== currentVal) {
                    $.data(this, 'originVal', $(this).val());
                    callback(currentVal);
                }
            });
        });
    }
})(jQuery);

/**
 * 文件上传页面
 * @param parentObj  文件上传窗口要显示的弹出层元素对象
 * @param parementObj  参数对象
 *        sysId：系统id
 *        groupGuid：组guid
 *        isSave：是否保存附件组数据库（true/false）
 *        dbType:保存在那个数据库（BJ/ZS）
 *        userGuid:操作用户guid
 *        isMulti：是否多附件上传（true/false）
 *        filter:限制文件上传类型（不限制时传 * ）
 *        url:回调url(zbCrossDomain/tbCrossDomain/fwCrossDomain)
 */
function upLoadFile(parentObj, parementObj){
	var upladoer = "<iframe id='mainFrame' src='"+newFileUpLoad+"?sysId="+ parementObj.sysId +"&groupGuid="+parementObj.groupGuid+"&isSave="+parementObj.isSave+"&dbType="+parementObj.dbType+"&userGuid="+parementObj.userGuid+"&url="+parementObj.url+"&isMulti="+parementObj.isMulti+"&filter="+parementObj.filter+"&fileType="+parementObj.fileType+"' width='99%' height='99%' frameborder:'0' scrolling:'no' ></iframe>";
	parentObj.window({
			title:"上传文件",
			height:400,
			width:700,
			minimizable:false,
			modal:true,
			collapsible:false,
			maximizable:false,
			resizable:false,
			content:upladoer
	});
}

/**
 * pdf文件签名
 * @param parentObj  文件上传窗口要显示的弹出层元素对象
 * @param parementObj  参数对象
 *        fileName：归档文件名称
 *        pdfDownUrl：pdf文件下载路径
 *        sysId：系统id
 *        userGuid:操作用户guid
 *        url:回调url(zbPdfCrossDomain/tbPdfCrossDomain/fwPdfCrossDomain)
 */
function pdfFileQianMing_bak(parentObj, parementObj){
	var sysName = getProjectName();
	var caKeyType = 1+2+4;
	if(sub_system_id == "400" || sub_system_id == "500"){
		caKeyType = 1;
	}else if(sub_system_id == "200" || sub_system_id == "300"){
		caKeyType = 6;
	}
	var fileNameTmp = "报表文件"; //默认文件名
	if(isNotBlank(parementObj.fileName)){
		try{
			fileNameTmp = parementObj.fileName.replace(/\'/g, "");
		}catch(e){}
	}
	
	var tWidth = $(window).width()*0.9;
	var tHeight = $(window).height()*0.9;
	var tLeft = $(window).width()*0.05;
	var tTop = $(window).height()*0.05;
	tHeight = tHeight - 50;
	tTop = tTop + 50;
	
	var upladoer = "<iframe id='mainFrame' src='" + pdfGuiDangQianMing + "?fileName=" + encodeURIComponent(fileNameTmp) + "&pdfUrl=" + parementObj.pdfDownUrl + "&sysId="+ parementObj.sysId +"&userGuid=" + parementObj.userGuid +"&url=" + parementObj.url +"&login_user_dn=" + login_user_dn +"&caKeyType=" + caKeyType +"&isCheXiao=" +parementObj.isCheXiao+"&tWidth=" +tWidth+"&tHeight=" +tHeight+"' width='98%' height='98%' frameborder:'0' scrolling:'no' ></iframe>";
	parentObj.window({
		title:"文件签名",
		height:tHeight,
		width:tWidth,
		left:tLeft,
        top:tTop,
        /*height:620,
		width:627,*/
		minimizable:false,
		modal:true,
		collapsible:false,
		maximizable:false,
		resizable:false,
		content:upladoer
	});
}

/**
 * pdf文件保存（原先是对pdf进行签名，现在不需要要签名，为了不大面积修改，该步骤修改为自动上传附件到文件系统）
 * @param parentObj  文件上传窗口要显示的弹出层元素对象
 * @param parementObj  参数对象
 *        fileName：归档文件名称
 *        pdfDownUrl：pdf文件下载路径
 *        sysId：系统id
 *        userGuid:操作用户guid
 *        url:回调url(zbPdfCrossDomain/tbPdfCrossDomain/fwPdfCrossDomain)
 */
function pdfFileQianMing(parentObj, parementObj){
	var fileNameTmp = "报表文件"; //默认文件名
	if(isNotBlank(parementObj.fileName)){
		try{
			fileNameTmp = parementObj.fileName.replace(/\'/g, "");
		}catch(e){}
	}
	//上传文件
	var resultFile = saveUploadPdfFile(parementObj.pdfDownUrl, fileNameTmp);
	if(isBlank(resultFile) || isBlank(resultFile.status) || !resultFile.status){
		alert("归档文件上传失败");
		return;
	}
	//调用回调函数
	callBackQianMing(resultFile.fileResult, parementObj);
}

function saveUploadPdfFile(fileUrl, fileName){
	var retObj = {};
	
	//是否保存成功
	var flag = false;
	try{
		//定义对象
		var vo = {};
		vo["fileUrl"] = fileUrl;
		vo["fileName"] = fileName;
		$.ajax({
			async: false,
            cache: false,
			type : 'POST',  
 			dataType : 'json', 
 			data: vo,
 			url: getProjectName()+'/filegroup/upLoadPdfFile.do',
 			success : function(data) {  
 				if(isAjaxSuccess(data)){
 		    		flag = true;
 		    		retObj["fileResult"] = data;
 		    	}else{
 		    		flag = false;
 		    	}
 		    },  
 		   	error : function(data) {  
 		   		flag = false;
 	        }  
 		});
	}catch(e){
		flag = false;
	}
	
	retObj["status"] = flag;
	return retObj;
}

function querySysHelp(parentObj, parementObj){
	var url = sysHelpPage+"?sysId="+ parementObj.sysId +"&menuName="+parementObj.menuName;
	parentObj.window({
		title:"系统帮助",
		height:500,
		width:1000,
		minimizable:false,
		modal:true,
		collapsible:false,
		maximizable:false,
		resizable:false,
		closed:true,
	    inline:false,
	    cache:false,
		href:url,
		onClose:function(){
		        var ue=UE.getEditor("hpEditor");
		        ue.destroy();
		}
	});

	
	parentObj.window("open");
}
/*function destroyWin(parentObj){
	//parentObj.window("destroy");
	UE.getEditor('hpEditor').ready(function() {
	    //this是当前创建的编辑器实例
	    this.destroy();
	})
}*/

/*
 * 文件上传后保存本地数据库
 * 参数：1.fArrray: 文件服务器返回数组对象
 *     2.groupGuid: 文件组Guid (如果groupGuid值为空则新创建组并保存文件在该组下，如果groupGuid有值则保存文件在传入的组中)
 *     3.数据库标识（BJ:报建库  ZS:正式库）
 * 返回值：object对象：
 *          status:状态   （true：成功   false:失败）
 *          groupGuid:文件所在组Guid
 */
function saveAttachFiles(fArrray, groupGuid, dbFlag){
	var retObj = {};
	
	var usrStr = "";
	if(dbFlag == "BJ"){
		usrStr = 'filegroup/addListBJ.do';
	}else if(dbFlag == "ZS"){
		usrStr = 'filegroup/addListZS.do';
	}else{
		retObj["status"] = false;
		return retObj;
	}
	
	//是否保存成功
	var flag = false;
	try{
		
		//定义对象
		var vo = {};
		var fileArray = new Array();
		$.each(fArrray, function(i, item){  
			var file = {};
			file["groupGuid"] = groupGuid || "";
			file["attachGuid"] = item.fileId;
			file["attachName"] = item.fileName;
			file["attachUploadTime"] = item.uploadTime;
			file["attachMD5"] = item.fileMd5;
			fileArray.push(file);
		});
		vo["groupList"] = fileArray;
		vo["groupGuid"] = groupGuid || "";
		var jstr = JSON.stringify(vo);
		$.ajax({
			async: false,
            cache: false,
			type : 'POST',  
 			contentType : 'application/json', 
 			dataType : 'json', 
 			data: jstr,
 			url: usrStr,
 			success : function(data) {  
 				if(isAjaxSuccess(data)){
 		    		flag = true;
 		    		groupGuid = data.groupGuid;
 		    	}else{
 		    		flag = false;
 		    	}
 		    },  
 		   	error : function(data) {  
 		   		flag = false;
 	        }  
 		});
	}catch(e){
		flag = false;
	}
	
	retObj["status"] = flag;
	retObj["groupGuid"] = groupGuid;
	return retObj;
}
 
/*
 * 根据guid删除文件
 * 参数： 1.dbType: 数据库类型  BJ：报建库  ZS:正式库
 *     2.fileGuid: 文件guid
 *     3.groupGuid: 附件组guid
 *     4.showType: 显示类型  table 表示已table格式展示，否则以：文件名  撤销按钮  的形式展示
 *     5.isShowDel： 是否显示删除/撤销按钮
 *     6.message: 提示信息:"删除" 或  "撤销"（显示信息为 ：你确定要删除吗？/你确定要撤销吗？/删除成功/撤销成功）
 * 返回值：无
 */
function deleteAttachFile(dbType, fileGuid, groupGuid, showType, isShowDel, message, thisObj,isPDF){
	debugger;
	//url
	var urlStr = "";
	if(dbType == "BJ"){
		urlStr = '../filegroup/deleteByFileGuidBJ.do?attachGuid='+fileGuid;
	}else if(dbType == "ZS"){
		urlStr = '../filegroup/deleteByFileGuidZS.do?attachGuid='+fileGuid;
	}else{
		alertMessage("数据库类型异常");
		return;
	}
	
	var content = "";
	try{
		if(confirm('你确定要'+ message +'吗？')) {  
			
			//删除文件服务器数据
			$.ajax({  
				async: false,
	            cache: false,
				type : 'POST',  
	 			contentType : 'application/json', 
	 			dataType : 'json', 
	 			url: urlStr,
		        success : function(data){  
		        	console.log(data.isZSHave);
		        	//删除本地数据
		        	if(dbType=="ZS"||(dbType=="BJ"&&!data.isZSHave)){ //文件不存在
			        	$.ajax({
			        		type : "GET",  
			 		        async:false,  
			 		        url: removeFile+"?fileId="+fileGuid,
			 		        dataType : "jsonp",//数据类型为jsonp  
			 		        jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数  
			 		        jsonpCallback:"jsonpCallback",
			 		        timeout: 5000,
				 			success : function(data) {  
				 				if(data.status == true ||data.code == 1 || data.code == 2 || data.code == "1" || data.code == "2"){
				 		    		flag = true;
				 		    		alertMessage(message+"成功");
				 		    		content = queryAttachFiles(dbType, groupGuid, showType, isShowDel,isPDF).content;
				 		    	}else{
				 		    		flag = false;
				 		    		alertMessage(message+"失败");
				 		    	}
				 		    },  
				 		   	error : function(data) {  
				 		   		flag = false;
				 		   		alertMessage(message+"失败");
				 	        }  
				 		});
			        	
			        	//重置列表页面
			        	var jObj = $(thisObj);
			        	if(showType == 'table'){
			        		jObj.parent().parent().parent().parent().parent().html(content);
			        	}else{
			        		jObj.parent().html(content);
			        	}
		        	}else{
		        		alertMessage(message+"成功");
	 		    		content = queryAttachFiles(dbType, groupGuid, showType, isShowDel,isPDF).content;
	 		    		var jObj = $(thisObj);
			        	if(showType == 'table'){
			        		jObj.parent().parent().parent().parent().parent().html(content);
			        	}else{
			        		jObj.parent().html(content);
			        	}
		        	}
		        },  
		        error:function(){  
		        	alertMessage(message+"失败");
		        }
		    });
		}else{
		}
	}catch(e){
	}
}


/*
 * 根据附件组guid查询文件
 * 参数： 1.数据库类型（从哪个数据库进行查询  BJ:报建库  ZS:正式库）
 *     2.groupGuid: 附件组Guid
 *     3.showType: 显示样式类型 ， table 表示已table格式展示，否则以：文件名  撤销按钮  的形式展示
 *     4.isShowDel: 是否显示删除及撤销按钮 ， true 显示，false 不显示
 *     (删除及撤销按钮上有  class="shenPiZhongHide",也可以根据该class动态处理按钮状态)
 * 返回值：Object对象
 *         content：拼接后的字符串
 */

/*
 * 根据附件组guid查询文件
 * 参数： 1.数据库类型（从哪个数据库进行查询  BJ:报建库  ZS:正式库）
 *     2.groupGuid: 附件组Guid
 *     3.showType: 显示样式类型 ， table 表示已table格式展示，否则以：文件名  撤销按钮  的形式展示
 *     4.isShowDel: 是否显示删除及撤销按钮 ， true 显示，false 不显示
 *     (删除及撤销按钮上有  class="shenPiZhongHide",也可以根据该class动态处理按钮状态)
 * 返回值：Object对象
 *         content：拼接后的字符串
 */
function queryAttachFiles(dbType, groupGuid, showType, isShowDel,isPDF,isShowCreateTime,isShowGuid){
	if(groupGuid == undefined || groupGuid == "undefined"){
		groupGuid = "";
	}
	isShowCreateTime = isShowCreateTime == null ? true : isShowCreateTime;
	//url
	var urlStr = "";
	if(dbType == "BJ"){
		urlStr = '../filegroup/queryByGroupGuidBJ.do?groupGuid='+groupGuid;
	}else if(dbType == "ZS"){
		urlStr = '../filegroup/queryByGroupGuidZS.do?groupGuid='+groupGuid;
	}else{
		alertMessage("数据库类型异常");
		return {content:""};
	}
	
	var retObj = {};
	retObj["content"] = "";
	retObj["count"] = 0;
	
	try{
		$.ajax({
			async: false,
            cache: false,
			type : 'POST',  
 			contentType : 'application/json', 
 			dataType : 'json', 
 			url:urlStr,
 			success : function(data) {  
 				var retObjTmp = createViewHtmlForLocal(data.rows, dbType, showType, isShowDel,isPDF,isShowCreateTime,isShowGuid);
 				
 				retObj["content"] = retObjTmp.content;
 				retObj["count"] = retObjTmp.count;
 		    },  
 		   	error : function(data) {  
 		   		retObj["content"] = "";
 		   	}  
 		});
	}catch(e){
		retObj["content"] = "";
	}
	return retObj;
}
//给招标文件，投标文件类似的附件信息在本实体的类型查附件信息
function querysingleFile(dbType, fileGuid,shixiang,fileLeiBie){
	if(fileGuid == undefined || fileGuid == "undefined"){
		fileGuid = "";
	}
	if(shixiang == undefined || shixiang == "undefined"){
		shixiang = "";
	}
	if(fileLeiBie == undefined || fileLeiBie == "undefined"){
		fileLeiBie = "";
	}
	//url
	var urlStr = "";
	var fileName = "";
	if(shixiang == ShiXiangLeiXing.TOUBIAOWENJIAN){
		urlStr = '../filegroup/querytbwjFjZS.do?groupGuid='+fileGuid+'&fileLeiBie='+fileLeiBie;
	}else if(shixiang == ShiXiangLeiXing.ZIGEYUSHENWENJIAN){
		urlStr = '../filegroup/queryzgyswjFjZS.do?groupGuid='+fileGuid;
	}
	else if(shixiang == ShiXiangLeiXing.ZIGEYUSHENSQWJ){
		urlStr = '../filegroup/queryzgyssqwjFjZS.do?groupGuid='+fileGuid;
	}
	else{
		if(dbType == "BJ"){
			 urlStr = '../filegroup/queryzbwjFjBJ.do?groupGuid='+fileGuid;
		}else if(dbType == "ZS"){
	         urlStr = '../filegroup/queryzbwjFjZS.do?groupGuid='+fileGuid;
		}else{
			alertMessage("数据库类型异常");
			return {content:""};
		}
	}

	var fjstr = "";
	try{
		$.ajax({
			async: false,
			cache: false,
			type : 'POST',  
			contentType : 'application/json', 
			dataType : 'json', 
			url:urlStr,
			success : function(data) {  
				fjstr = createViewHtmlForSigleFile(fileGuid,data);
			},  
			error : function(data) {  
				fjstr = "";
			}  
		});
	}catch(e){
		fjstr = "";
	}
	return fjstr;
}

function createViewHtmlForSigleFile(fileGuid,fileName){
	var str = "";
	str = str + '<a href="'+ newFileDownLoad +'?fileId='+ fileGuid +'"><span style="color: blue;">'+ dealNull(fileName) +'</span></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	return str;
}

/*
 * 显示附近信息
 * 参数： 1.rows: 附件组表中查询出来的附件组列表
 *     2.数据库类型（从哪个数据库进行查询  BJ:报建库  ZS:正式库） （删除按钮，删除后查询使用）
 *     3.showType: 显示样式类型 ， table 表示已table格式展示，否则以：文件名  撤销按钮  的形式展示
 *     4.isShowDel: 是否显示删除及撤销按钮 ， true 显示，false 不显示
 *     (删除及撤销按钮上有  class="shenPiZhongHide",也可以根据该class动态处理按钮状态)
 * 返回值：string:拼接后的字符窜
 */
function createViewHtmlForLocal(rows, dbType, showType, isShowDel,isPDF,isShowCreateTime,isShowGuid){
	
	isShowCreateTime = isShowCreateTime == null ? true : isShowCreateTime;
	var str = "";
	var count = 0;
	if(showType == 'table'){  //table形式
		str = str + '<table>';
		if(isShowDel == true || isShowDel == 'true'){
			str = str + '  <tr>';
			str = str + '    <th width="10%">序号</th>';
			if(isShowGuid == true || isShowGuid == 'true'){
				str = str + '    <th width="25%">文件名</th>';
				str = str + '    <th width="25%">文件Guid</th>';
			}else{
				str = str + '    <th width="40%">文件名</th>';
			}
			if(isShowCreateTime == true || isShowCreateTime == 'true') {
				str = str + '    <th width="30%">创建时间</th>';
			}
			str = str + '    <th width="20%">操作</th>';
			str = str + '  </tr>';
			$.each(rows, function(i, item){  
				str = str + '<tr>';
				str = str + '<td>'+ eval(i+1) +'</td>';
				if(!isPDF){
					str = str + '<td><a href="'+ newFileDownLoad +'?fileId='+ item.attachGuid +'" title="点击下载"><span style="color: blue;">'+ dealNull(item.attachName) +'</span></a></td>';
				}else{
					str = str + '<td><a href="javascript:void(0);" onclick="yuLanPDF(\''+ item.attachGuid +'\')" title="点击预览"><span style="color: blue;">'+ dealNull(item.attachName) +'</span></a></td>';
				}
				if(isShowGuid == true || isShowGuid == 'true'){
					str = str + '<td>'+item.attachGuid+'</td>';
				}
				if(isShowCreateTime == true || isShowCreateTime == 'true') {
					str = str + '<td>'+ dealNull(new Date(item.attachUploadTime).Format("yyyy-MM-dd HH:mm:ss")) +'</td>';
				}
				str = str + '<td><a class="shenPiZhongHide" href="javascript:void(0)" onclick="deleteAttachFile(\''+ dbType +'\',\''+ dealNull(item.attachGuid) +'\',\''+ dealNull(item.groupGuid) +'\',\''+ showType +'\',\''+ isShowDel +'\',\'删除\',this,\''+ isPDF +'\')">删除</a></td>';
				str = str + '</tr>';
				count++;
		    });
		}else{
			str = str + '  <tr>';
			str = str + '    <th width="15%">序号</th>';
			str = str + '    <th width="50%">文件名</th>';
			if(isShowCreateTime == true || isShowCreateTime == 'true') {
					str = str + '    <th width="35%">创建时间</th>';
			}
			str = str + '  </tr>';
			$.each(rows, function(i, item){  
				str = str + '<tr>';
				str = str + '<td>'+ eval(i+1) +'</td>';
				if(!isPDF){
					str = str + '<td><a href="'+ newFileDownLoad +'?fileId='+ item.attachGuid +'" title="点击下载"><span style="color: blue;">'+ dealNull(item.attachName) +'</span></a></td>';
				}else{
					str = str + '<td><a href="javascript:void(0);" onclick="yuLanPDF(\''+ item.attachGuid +'\')" title="点击预览"><span style="color: blue;">'+ dealNull(item.attachName) +'</span></a></td>';
				}
				if(isShowCreateTime == true || isShowCreateTime == 'true') {
					str = str + '<td>'+ dealNull(new Date(item.attachUploadTime).Format("yyyy-MM-dd HH:mm:ss")) +'</td>';
				}
				str = str + '</tr>';
				count++;
		    });
		}
		str = str + '</table>';
	}else{
		if(isShowDel == true || isShowDel == 'true'){
			$.each(rows, function(i, item){  
				str = str + '<a href="'+ newFileDownLoad +'?fileId='+ item.attachGuid +'"><span style="color: blue;">'+ dealNull(item.attachName) +'</span></a>';
				str = str + '<span class="input_btn shenPiZhongHide" onclick="deleteAttachFile(\''+ dbType +'\',\''+ dealNull(item.attachGuid) +'\',\''+ dealNull(item.groupGuid) +'\',\''+ showType +'\',\''+ isShowDel +'\',\'撤销\',this)">撤销</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dealNull(new Date(item.attachUploadTime).Format("yyyy-MM-dd HH:mm:ss"));
				count++;
			});
		}else{
			$.each(rows, function(i, item){  
				str = str + '<a href="'+ newFileDownLoad +'?fileId='+ item.attachGuid +'"><span style="color: blue;">'+ dealNull(item.attachName) +'</span></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				count++;
			});
		}
	}
	var retObj = {};
	retObj["content"] = str;
	retObj["count"] = count;
	return retObj;
}


/*
 * 显示附件信息（删除/撤销按钮需要实现函数: deleteFileBack(fileId)）
 * 参数： 1.files: 文件系统成功返回后的文件数组
 *     2.showType: 显示样式类型 ， table 表示已table格式展示，否则以：文件名  撤销按钮  的形式展示
 *     3.isShowDel: 是否显示删除及撤销按钮 ， true 显示，false 不显示
 *     (删除及撤销按钮上有  class="shenPiZhongHide",也可以根据该class动态处理按钮状态)
 * 返回值：stirng:拼接后的字符串
 */
function createViewHtml(fArray, showType, isShowDel){

	var str = "";
	if(showType == 'table'){  //table形式
		str = str + '<table>';
		if(isShowDel == true){
			str = str + '  <tr>';
			str = str + '    <th width="10%">序号</th>';
			str = str + '    <th width="40%">文件名</th>';
			str = str + '    <th width="30%">创建时间</th>';
			str = str + '    <th width="20%">操作</th>';
			str = str + '  </tr>';
			$.each(fArray, function(i, item){  
				str = str + '<tr>';
				str = str + '<td>'+ eval(i+1) +'</td>';
				str = str + '<td><a href="'+ newFileDownLoad +'?fileId='+ item.fileId +'">'+ dealNull(item.fileName) +'</a></td>';
				str = str + '<td>'+ dealNull(new Date(Number(item.uploadTime)).Format("yyyy-MM-dd HH:mm:ss")) +'</td>';
				str = str + '<td><a class="shenPiZhongHide" href="javascript:deleteFileBack(\''+ dealNull(item.fileId) +'\')">删除</a></td>';
				str = str + '</tr>';
		    });
		}else{
			str = str + '  <tr>';
			str = str + '    <th width="15%">序号</th>';
			str = str + '    <th width="50%">文件名</th>';
			str = str + '    <th width="35%">创建时间</th>';
			str = str + '  </tr>';
			$.each(fArray, function(i, item){  
				str = str + '<tr>';
				str = str + '<td>'+ eval(i+1) +'</td>';
				str = str + '<td><a href="'+ newFileDownLoad +'?fileId='+ item.fileId +'">'+ dealNull(item.fileName) +'</a></td>';
				str = str + '<td>'+ dealNull(new Date(Number(item.uploadTime)).Format("yyyy-MM-dd HH:mm:ss")) +'</td>';
				str = str + '</tr>';
		    });
		}
		str = str + '</table>';
	}else{
		if(isShowDel == true){
			$.each(fArray, function(i, item){  
				str = str + '<a href="'+ newFileDownLoad +'?fileId='+ item.fileId +'">'+ dealNull(item.fileName) +'</a>';
				str = str + '<span class="input_btn shenPiZhongHide" onclick="deleteFileBack(\''+ dealNull(item.fileId) +'\')">撤销</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		    });
		}else{
			$.each(fArray, function(i, item){  
				str = str + '<a href="'+ newFileDownLoad +'?fileId='+ item.fileId +'">'+ dealNull(item.fileName) +'</a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		    });
		}
	}
	return str;
}

//获取当前项目名称
function getProjectName()
{
   /*//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp  
   var pathName=window.document.location.pathname;  
   //获取带"/"的项目名，如：/uimcardprj  
   return pathName.substring(0,pathName.substr(1).indexOf('/')+1);*/
	return baseXMName_X6F6C3D75;
}

//获取服务器系统时间，毫秒数
function getSystemTime(){

	var longTime = 0;
	try{
		$.ajax({
			async: false,
            cache: false,
			type : 'POST',  
 			contentType : 'application/json', 
 			dataType : 'json', 
 			url:getProjectName()+'/dict/getSystemTime.do',
 			success : function(data) {  
 				longTime = data.dateTime;
 		    },  
 		   	error : function(data) {  
 		   		longTime = 0;
 		   	}  
 		});
	}catch(e){
		longTime = 0;
	}
	return longTime;
}

//从服务器获取新的guid
function getNewGuid(){

	var guid = '';
	try{
		$.ajax({
			async: false,
            cache: false,
			type : 'POST',  
 			contentType : 'application/json', 
 			dataType : 'json', 
 			url:getProjectName()+'/dict/getNewGUID.do',
 			success : function(data) {  
 				guid = data.guid;
 		    },  
 		   	error : function(data) {  
 		   		guid = '';
 		   	}  
 		});
	}catch(e){
		guid = '';
	}
	return guid;
}

//获取备案记录table
function getShenPiJiLiTable(shiXiangGuid, shiXingLeiXing){

	var content = '';
	try{
		$.ajax({
			async: false,
            cache: false,
			type : 'POST',  
 			contentType : 'application/json', 
 			dataType : 'json', 
 			url:getProjectName()+'/dict/querySPList.do?shiXiangGuid='+shiXiangGuid+'&shiXingLeiXing='+shiXingLeiXing,
 			success : function(data) {  
 				content = createShenPiJiLiTable(data);
 		    },  
 		   	error : function(data) {  
 		   		//guid = '';
 		   	}  
 		});
	}catch(e){
		content = '';
	}
	
	var result = {};
	result["content"] = content;
	return result;
}

function createShenPiJiLiTable(rows){
	var str = '';
	str = str + '<table>';
	str = str + '   <tr>';
	str = str + '       <th width="15%" style="text-align:left;padding-left:5px;">提交时间</th>';
	str = str + '       <th width="10%" style="text-align:left;padding-left:5px;">确认人</th>';
	str = str + '       <th width="15%" style="text-align:left;padding-left:5px;">确认时间</th>';
	str = str + '       <th width="10%" style="text-align:left;padding-left:5px;">确认状态</th>';
	str = str + '       <th width="20%" style="text-align:left;padding-left:5px;">备注</th>';
	str = str + '       <th width="30%" style="text-align:left;padding-left:5px;">确认意见</th>';
	str = str + '   </tr>';
	$.each(rows , function(i, item){  
		str = str + '   <tr>';
		str = str + '       <td>'+ dealNull(formatToDateTime(item.shenPiStartTime)) +'</td>';
		str = str + '       <td>'+ dealNull(item.shenPiRenName) +'</td>';
		str = str + '       <td>'+ formatToDateTime(item.shenPiEndTime) +'</td>';
		str = str + '       <td>'+ getShenPiZhuangTaiText(item.shenPiZhuangTai) +'</td>';
		str = str + '       <td>'+ dealNull(formatShenPiBeiZhuAll(item.beiZhu)) +'</td>';
		str = str + '       <td>'+ dealNull(item.shenPiYiJian) +'</td>';
		str = str + '   </tr>';
	});
	
	str = str + '</table>';
	return str;
}

function len(s) {//获取字符串长度的方法
		var l = 0; 
		var a = s.split(""); 
		for (var i=0;i<a.length;i++) { 
			if (a[i].charCodeAt(0)<299) { 
				l++; 
			} else { 
				l+=2; 
			} 
		} 
		return l;
	}

//字符串CA签名
/**附原文的数据签名
**dateTime:2008/8/15 19:00
**param: strData 字符数据
**return: 字符串
**description:对字符数据进行签名，若成功，返回签名后密文字符串，若失败，返回空(""), 返回 false 取消签名。
*/
function szcaSignStr_bak(str, xuLieHao){
	//???? 确认是否需要增加这一步，目前不加这个操作签名不成功，加这操作后可能选择有可能不是登陆用户的CA（机器上有多个证书时）
	try{
		// AKeyType 证书类型 1-机构证书， 2-业务证书，4-个人证书， 1+2， 1+2+4, 2+4
		var sysName = getProjectName();
		var keyType = 1+2+4;
		if(sub_system_id == "400" || sub_system_id == "500"){
			keyType = 1;
		}else if(sub_system_id == "200" || sub_system_id == "300"){
			keyType = 6;
		}
		//初始化
		SZCAOcx.AxInit();
        //证书筛选
        SetCertFilter(keyType, 0);
		
        if(isNotBlank(xuLieHao)){
        	var strFilter = getCertFilterStr(keyType,0);
        	strFilter = strFilter.replace(";#;#;",";#;"+ xuLieHao +";");
        	//"SC;SZCA;#;"+ xuLieHao +";1.2.86.11.7.7550201:Organizational";
        	//设置证书过滤条件
    		SZCAOcx.AxSetCertFilterStr(strFilter );
        }
		
		var resultStore = SZCAOcx.AxSetKeyStore();
		if(!resultStore){  //取消签名
			return false;
		}
		var dn = SZCAOcx.AxGetCertInfo("DN");
		var caInfo = {};
		var dnPairs = dn.split(",");
		for(var i = 0; i < dnPairs.length; i++){
			var dnPair = dnPairs[i].split("=");
			caInfo[dnPair[0]] = dnPair[1];
		}
		if(caInfo['title'] || caInfo['T']){// 个人证书, 使用title验证
			dn = caInfo['title'] || caInfo['T'];
		}
		if(dn != login_user_dn){
			alertMessage("签名验证失败，不能使用其它CA签名");
			return false;
		}
		
		SZCAOcx.AxSetDetach(false);//签名前加入此方法
		var result = AttachSign(str);
	}catch(e){
		alertMessage("签名验证失败，请检查是否CA登录");
		return;
	}
	return result;
	
}

function szcaSignStr(str, xuLieHao){
	try{
		/*var TopCACtrl = getTopESAC();
		var stCert = TopCACtrl.SE_GetCert(1);
		if (stCert == "")
		{
			alert("请插入证书！");
			return false;
		}
		var stCertInfo = TopCACtrl.SE_GetCertInfo(stCert, 20);
		if (stCertInfo == "")
		{
			alert("读取证书失败");
			return false;
		}
		
		//服务、监管系统重新获取
		if(sub_system_id == "200" || sub_system_id == "300"){
			stCertInfo = TopCACtrl.SE_GetCertInfoByOid(stCert, "2.5.4.4");
			if (stCertInfo == "")
			{
				alert("读取证书失败");
				return false;
			}
		}
		
		if(stCertInfo != login_user_dn){
			alertMessage("签名验证失败，不能使用其它CA签名");
			return false;
		}
		
		var sSignTxt = TopCACtrl.SE_SignData(str);
		if (sSignTxt == ""){
			alert("签名失败！");
			return false;
		}
		return sSignTxt;*/
		if(isBlank(ca_leixing)){
			ca_leixing = checkCAType();
		}
		if(ca_leixing == 1){
			//天威ca
			return signDataTianWeiCa(str, true);
		}
		//湖北ca
		return signDataHuBeiCa(str, true);
	}catch(e){
		alertMessage("签名失败，请检查是否CA登录");
		return false;
	}
	return false;
	
}

/**
 * 获取ca证书信息
 * @returns 信息对象 object
 * 	 版本号： object.ver
 * 	 序列号： object.sn
 * 	 证书主题： object.dn
 * 	 有效起始日期： object.timeb
 * 	 有效终止日期： object.timee
 * 	 颁发者主题： object.issuer
 * 	 名称： object.cn
 * 	 编号： object.ou
 */
function getSZCAInfo_bak(){
	
	try{
		//初始化
		SZCAOcx.AxInit();
        //证书筛选
        SetCertFilter(1, 0);
        //获取证书
        var str = SZCAOcx.AxSetKeyStore();
        if(!str){  //取消
			return false;
		}
    	
		var result = {};
		result["ver"] = SZCAOcx.AxGetCertInfo("VER");
		result["sn"] = SZCAOcx.AxGetCertInfo("SN");
		result["dn"] = SZCAOcx.AxGetCertInfo("DN");
		result["timeb"] = SZCAOcx.AxGetCertInfo("TIMEB");
		result["timee"] = SZCAOcx.AxGetCertInfo("TIMEE");
		result["issuer"] = SZCAOcx.AxGetCertInfo("ISSUER");
		result["cn"] = "";
		result["ou"] = "";
		if(isNotBlank(result.dn)){
			var snStr = result.dn; //证书主体
			var snArray = snStr.split(","); //字符分割 
			for (var i=0;i<snArray.length ;i++ ) { 
				if(i == 0){
					var names = snArray[0].split("=");
					if(names.length >= 2){
						result["cn"] = names[1];
					}
				}else if(i == 1){
					var bhs = snArray[1].split("=");
					if(bhs.length >= 2){
						result["ou"] = bhs[1];
					}
				}else{
					break;
				}
			} 
		}
		
		return result;
	}catch(e){
		alertMessage("获取ca信息失败，请检查ca是否正常！");
		return;
	}
}
function getSZCAInfo(){
	
	try{
		/*var TopCACtrl = getTopESAC();
		
		var stCert = TopCACtrl.SE_GetCert(1);
		if (stCert == "")
		{
			alert("请插上天威证书！");
			return false;
		}
		var stCertInfo = TopCACtrl.SE_GetCertInfo(stCert, 20);
		if (stCertInfo == "")
		{
			alert("获取证书错误！");
			return false;
		}
		//企业信息模版（昆明）： "CN=【企业名称】,O=【组织机构代码】,ST=【省份】,C=CN"
		//自然人信息模版（昆明）： "CN=【姓名】,OU=【自然人/法定代表人/负责人/造价师】,O=【身份证号】,ST=【省份】,C=CN"
		var CACorp = TopCACtrl.SE_GetCertInfoByOid(stCert, "2.5.4.4");//组织机构代码
		var CAName = stCertInfo.substring(stCertInfo.indexOf(", CN=") + 5);
		var CA_OU = stCertInfo.substring(stCertInfo.indexOf("OU=") + 3, stCertInfo.indexOf(", O="));
		var usbkeySequence = TopCACtrl.SE_GetCertInfo(stCert, 2);
		var begin_Date ="20"+ TopCACtrl.SE_GetCertInfo(stCert, 11).substring(0, 12); //获取起始日期（150720040353Z）
		var end_Date ="20"+ TopCACtrl.SE_GetCertInfo(stCert, 12).substring(0, 12); //获取截止日期（150720040353Z）
		
		var province_Name = TopCACtrl.SE_GetCertInfo(stCert, 16); //用户省份
		var city_Name = TopCACtrl.SE_GetCertInfo(stCert, 18); //用户城市
		var result = {};
		result["ver"] = "";
		result["sn"] = stCert;
		result["dn"] = stCertInfo;
		result["timeb"] = begin_Date;
		result["timee"] = end_Date;
		result["issuer"] = "";
		result["cn"] = CAName;
		result["ou"] = CA_OU;
		
		return result;*/
		var CAInfoObj = {};
		if(ca_leixing == 1){
			//天威ca
			CaInfoObj = getTianWeiCaInfo();
		}else if(ca_leixing == 2){
			//湖北ca
			CaInfoObj = getHuBeiCaInfo();
		}else{
			alert("获取证书信息失败!");
			return false;
		}
		
		var result = {};
		result["ver"] = "";
		result["sn"] = CaInfoObj.Cert;
		result["dn"] = CaInfoObj.ZhuTi;
		result["timeb"] = CaInfoObj.BeginDate;
		result["timee"] = CaInfoObj.EndDate;
		result["issuer"] = "";
		result["cn"] = CaInfoObj.CAName;
		result["ou"] = CaInfoObj.CACorp;
		
		return result;
	}catch(e){
		alertMessage("获取ca信息失败，请检查ca是否正常！");
		return false;
	}
}


//特殊单元格样式
function IdStyler(value, row, index) {
	return 'text-align:left;width:70px;white-space:nowrap;padding:0 20px 0 10px;overflow: hidden;';
}

function numToChinese() {
		var num = $("#htJinE").val();
		if (!/^\d*(\.\d*)?$/.test(num)) {
			alertMessage("数字格式有误!");
			return "Number is wrong!";
		}
		var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
		var BB = new Array("", "拾", "佰", "仟", "萬", "億", "点", "");
		var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
		for (var i = a[0].length - 1; i >= 0; i--) {
			switch (k) {
			case 0:
				re = BB[7] + re;
				break;
			case 4:
				if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$")
						.test(a[0]))
					re = BB[4] + re;
				break;
			case 8:
				re = BB[5] + re;
				BB[7] = BB[5];
				k = 0;
				break;
			}
			if (k % 4 == 2 && a[0].charAt(i + 2) != 0
					&& a[0].charAt(i + 1) == 0)
				re = AA[0] + re;
			if (a[0].charAt(i) != 0)
				re = AA[a[0].charAt(i)] + BB[k % 4] + re;
			k++;
		}

		if (a.length > 1) //加上小数部分(如果有小数部分) 
		{
			re += BB[6];
			for (var i = 0; i < a[1].length; i++)
				re += AA[a[1].charAt(i)];
		}
		$("#chineseNum").val(re);
	}

//获取浏览器版本号
function getBrowserInfo() {
	var agent = navigator.userAgent.toLowerCase();
	var regStr_ie = /msie [\d.]+;/gi;
	var regStr_ff = /firefox\/[\d.]+/gi
	var regStr_chrome = /chrome\/[\d.]+/gi;
	var regStr_saf = /safari\/[\d.]+/gi;
	//IE
	if (agent.indexOf("msie") > 0) {
		return agent.match(regStr_ie);
	}
}

function formatTime(value) {
	
	return formatDateByType(value, "yyyy年MM月dd日");
	/*if (isBlank(value))
		return '';
	var year = new Date(value).getYear();
	var month = new Date(value).getMonth();
	var date = new Date(value).getDate();
	if (month < 9) {
		month = 0 + "" + (month + 1);
	} else {
		month++;
	}
	if (date < 10) {
		date = 0 + "" + date;
	}
	if(getBrowserInfo() != ("msie 8.0;")){
		year += 1900
	}
	var time = year + "年" + month + "月" + date + "日";
	return time;*/
}

//confirmMessage(title, msg, fn, fnParam)
/**
 * urlTmp:url
 * tableId:datagrid的jquery对象， 如： $("#ddd")
 * dataObj:参数对象
 */
function deleteObject(urlTmp, tableId, dataObj) {
	var fnParam = {
		url: urlTmp,
		tableObj: tableId,
		data: dataObj
	};
	confirmMessage('确认删除', '确认要删除？', deleteObjectBack, fnParam);
}

function deleteObjectBack(paramObj){
	var jsonStr = "";
	if(!isNotBlank(paramObj.data)){
		jsonStr = "{}";
	}else{
		jsonStr = JSON.stringify(paramObj.data);
	}

	$.ajax({
		type : "post",
		url : paramObj.url,
		data: jsonStr,
		success : function(data) {
			if(data.code){
				alertMessage(data.message);
				return;
			}
			paramObj.tableObj.datagrid('load');//重新执行请求，请求那段代码，回生成一个表格
		},
		error: function(data){
			
		}
	});
}

/**
 * urlTmp:url
 * tableId:datagrid的jquery对象， 如： $("#ddd")
 * dataObj:参数对象
 */
function deleteObjectByJson(urlTmp, tableId, dataObj) {
	var fnParam = {
		url: urlTmp,
		tableObj: tableId,
		data: dataObj
	};
	confirmMessage('确认删除', '确认要删除？', deleteObjectBackByJson, fnParam);
}

function deleteObjectBackByJson(paramObj){
	var jsonStr = "";
	if(!isNotBlank(paramObj.data)){
		jsonStr = "{}";
	}else{
		jsonStr = JSON.stringify(paramObj.data);
	}

	$.ajax({
		type : "post",
		dataType: "json",
        contentType : 'application/json',
		url : paramObj.url,
		data: jsonStr,
		success : function(data) {
			if(data.code){
				alertMessage(data.message);
				return;
			}
			paramObj.tableObj.datagrid('load');//重新执行请求，请求那段代码，回生成一个表格
		},
		error: function(data){
			
		}
	});
}

function refreshFunc() {
	$(".easyui-datagrid").datagrid("reload");
}

/**************datagrid*****************/
/**
 * 警告消息框（异步）
 * @param title：在头部面板显示的标题文本。
 * @param msg：显示的消息文本。
 * @param icon：显示的图标图像。可用值有：error,question,info,warning。（为空将不显示图标）
 * @param fn: 在窗口关闭的时候触发该回调函数。（可以为空）
 * @param fnParam: 回调函数返回的参数（可以为空）
 */
function alertMessage(msg, title, icon, fn, fnParam){
	try{
		window.parent.alertMessageParent(msg, title, icon, fn, fnParam);
	}catch(e){
		console.log(e);
	}
}

/**
 * 消息提示框（异步）
 * @param title：在头部面板显示的标题文本。
 * @param msg：显示的消息文本。
 * @param showType:显示效果（null,slide(由上到下渐出),fade(由无到有渐出),show(由左上角到右下角渐出)。默认：slide）
 * 			null：无动态效果
 * 			slide：由上到下渐出
 * 			fade：由无到有渐出
 * 			show：由左上角到右下角渐出
 * @param showPosition:显示位置 (默认：Center 页面中间)
 * 			TopLeft： 上左
 * 			TopCenter： 上中
 *			TopRight： 上有
 *			CenterLeft： 中左
 *			Center： 中
 *			CenterRight： 中右
 *			BottomLeft： 下左
 *			BottomCenter： 下中
 *			BottomRight： 下右
 */
function showMessage(message, title, showType, showPosition ){
	window.parent.showMessageParent(message, title, showType, showPosition )
}

/**
 * 对话消息框（异步）
 * @param title：在头部面板显示的标题文本。
 * @param msg：显示的消息文本。
 * @param fn: 在窗口关闭的时候触发该回调函数。
 * @param fnParam: 回调函数返回的参数
 */
function confirmMessage(msg, title, fn, fnParam){
	window.parent.confirmMessageParent(msg, title, fn, fnParam)
}

/**
 * 警告消息框（同步）
 * @param msg：显示的消息文本。
 */
function alertMessageWindow(msg){
	alert(msg);
}

/**
 * 对话消息框（同步）
 * @param msg：显示的消息文本。
 * @returns  boolean  (true/false)
 */
function confirmMessageWindow(msg){
	return confirm(msg);
}


/*
 * 网页内不重新打开浏览器 ，显示pdf
 */
function showPdfIfream(fileId,fileType){
	if(isBlank(fileId)) {
		$("#pdf_div").text("");
		return;
	}
	$("#pdf_div").text("");
	var pdfUrl;
	if(fileType == "zgsc") {
		pdfUrl = pdfPath+'?fileId='+fileId +'&fileType=' + fileType;
	} else {
		pdfUrl = pdfPath+'?fileId='+fileId +'&fileType=0';
	}
	var upladoer = "<iframe id='mainFrame' src='"+pdfUrl+"' width='99%' height='99%' frameborder:'0' scrolling:'no' ></iframe>";
	$("#pdf_div").append(upladoer)
}


/**
 * 重新打开一个浏览器窗口，预览pdf
 * @param fileId
 */
function yuLanPDF(fileId){
//	window.open(pdfPath+"?fileId="+fileId,'','height=screen.height, width=screen.width,scrollbars=yes,status =yes')
	var pdfUrl;
	if(fileType == "zgsc") {
		pdfUrl = pdfPath+'?fileId='+fileId +'&fileType=' + fileType;
	} else {
		pdfUrl = pdfPath+'?fileId='+fileId +'&fileType=0';
	}
	window.open(pdfUrl,'','height=screen.height, width=screen.width,top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
}

function isAjaxSuccess(data){
	//data不存在返回失败
	if(data == undefined) return false;
	//data存在且code不存在则认为成功，否则失败
	if(data.code == undefined) return true;
	
	return false;
}

function dealAjaxError(data){
	if(isNotBlank(data) && isNotBlank(data.message)){
		alertMessage(data.message);
		return ;
	}
	switch (data.status){
	/*case(500):
		alert("服务器系统内部错误");
		break;*/
	case(401):
		alertMessage("登录超时，请重新登录！");
		break;
	case(403):
		alertMessage("无权限执行此操作");
		break;
	case(408):
		alertMessage("请求超时");
		break;
	default:
		alertMessage("请求失败");
	}
	//alertMessage("请求失败");
}
//根据下标移除数组中的元素
Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i] 
        } 
    } 
    this.length-=1 
} 

	function formatShenPiZhuangTai(val, row, index) {
		if (val) {
			if (val == 1001) {
				return '<em style="font-style:normal;">未提交</em>';
			}	
			if (val == 1002) {
				return '<i style="color:#1480dc;font-style:normal;">已提交备案</i>';
			}	
			if (val == 1003) {
				return '预受理中';
			}
			if (val == 1004) {
				return '<em style="color:#3c8e0d; font-weight:100;">预受理通过</em>';
			}
			if (val == 1005) {
				return '<em style="font-style:normal;">预受理不通过</em>';
			}
			if (val == 1006) {
				return '受理中';
			}
			if (val == 1007) {
				return '<em style="color:#3c8e0d; font-weight:100;">受理通过</em>';
			}
			if (val == 1008) {
				return '<em style="font-style:normal;">受理不通过</em>';
			}	
			if (val == 1009) {
				return '备案中';
			}
			if (val == 1010) {
				return '<em style="color:#3c8e0d; font-weight:100;">备案通过</em>';
			}
			if (val == 1011) {
				return '<em style="font-style:normal;">备案不通过</em>';
			}
			if (val == 1012) {
				return '<em style="color:#3c8e0d; font-weight:100;">办结</em>';
			}
		}
	}
	
	//js增加replaceAll方法
	String.prototype.replaceAll  = function(s1,s2){    
        return this.replace(new RegExp(s1,"gm"),s2);    
	}
	
	//对象获取焦点
	function checkFormDataBackCall(obj){
		obj.focus();
	}
	
	//格式验证
	function checkDoubleFormat(type,value){
		var regStr = "";
		if(type == "double"){
			regStr = "^[0-9]+(.[0-9]{1,6})?$";
		}else if(type == "doubleT"){
			regStr = "^[0-9]+(.[0-9]{1,2})?$";
		}else if(type == "doubleZF"){
			regStr = "^[-]?[0-9]+(.[0-9]{1,6})?$";
		}else if(type == "number"){
			regStr = "^\\d+$";
		}else if(type == "mobile"){
			regStr = "^((\\+86)|(86))?(1)\\d{10}$";
		}else{
			return false;
		}
		var reg = new RegExp(regStr);  
		if(reg.test(value)){  
			return true;  
		}else{
			return false;
		}
	}
	
	function showHelp(moduleCode,menuCode){
		window.open(getProjectName()+"/help.html?moduleCode="+moduleCode+"&menuCode="+menuCode);
	}
	
	//施工非园林，监理，非批量招标
	function isSGJLNotPLZB(ggbd){
		var gcLeiXing = ggbd.bd.gcLeiXing;
		//if(((gcLeiXing == GongChengLeiXing.SHIGONG && "SG_YL" != ggbd.bd.gcZiLei) 
		if((gcLeiXing == GongChengLeiXing.SHIGONG
				|| gcLeiXing == GongChengLeiXing.JIANLI) && ggbd.gc.isPLZB == false){
			return true;
		}
		return false;
	}
	function isBlankOrSpace(value){
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
		if(value === " "){
			return true;
		}
		return false;
	}
	//ie8不支持console.log()的解决
	window.console = window.console || (function(){  
	    var c = {}; 
	    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};  
	    return c;  
	})();  function checkPassword(val){
		var patrn=/[a-zA-Z]+|\d+/;
		if (!patrn.exec(val)){
			return false;
		} 
		return true;
	}
	function isNumber(val){
		if(isNull(val)){
			return false;
		}
		if(isNaN(val)){
			return false;
		}
		if(val.toString().length>1){
			var FirstChar=val.toString().substr(0,1);
			if(FirstChar=="0"){
				return false;
			}
		}
		return true;
	}
	//为null,'','    '
	function isNull(str){
		if(str == undefined){
			return true;
		}
		if(str == "undefined"){
			return true;
		}
		if(str == null){
			return true;
		}
		if(str == "null"){
			return true;
		}
		if (str == "") return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	} 
	
	function recordCz() {
	    $("#win_CaoZuoJL").window({
	   	title:'录入操作原因及附件',
	       width:950,    
	       height:320,    
	       modal:true,
	       maximizable:false,
	       minimizable:false,
	       collapsible:false,
	       closed:true,
	       inline:false,
	       tools:"#czjlsearchTool",//弹出层搜索框
	       href:'../czjl/caoZuoJL_win.html'
	   });
	  $("#win_CaoZuoJL").window("open");
	}
	
    //数字转中文大写金额
	function numberToBigChinese(n) {
	        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
	            return "数据非法";
	        var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
	            n += "00";
	        var p = n.indexOf('.');
	        if (p >= 0)
	            n = n.substring(0, p) + n.substr(p+1, 2);
	            unit = unit.substr(unit.length - n.length);
	        for (var i=0; i < n.length; i++)
	            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
	        return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
	}
	
