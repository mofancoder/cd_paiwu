var keys;
function getGongYao(password,isGuiFan){
	$.ajax({
		async: false,
		cache: false,
		type : 'POST',  
		dataType: "json", 
		data: {
			"isGuiFan":isGuiFan
		},
		url: 'calogin/putPassisGuiFanInSession.do',
		success: function(data) {
		},
		error : function(data) {  
		} 
	});
	$.ajax({
        async: false,
        cache: false,
        type : 'POST',  
        dataType: "json",
        contentType : 'application/json',  
        data: {},
        url: 'calogin/getPublicKey.do',
        success: function(data) {
        	var obj = eval('('+data.output+')');
        	$.jCryption.getKeys(obj,function(receivedKeys) {  
    			keys = receivedKeys;  
    		});  
        	//公钥加密
        	$.jCryption.encrypt(password,keys,function(encryptedPasswd){
        		$("#realPassword").val(encryptedPasswd);
        		$("#realYanZhengMa").val($("#yanZhengMa").val());
        		$("#module-login-form").submit();
        	});
        },
        error : function(data) {  
            alert("error") ; 
        } 
    });
}