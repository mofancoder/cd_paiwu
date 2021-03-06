function getCerts_obj(){
	//1.声明相关对象并实例化
	try{
		certs_obj = new ActiveXObject("UCAPICOM.CertificateCollectionX");
	}catch(e){
		alert(e.description);
	}
	
	//2.设置证书过滤属性并加载
	certs_obj.CryptoInterface = 1;
	//1为SKF实现方式，2为CSP实现方式
	certs_obj.CF_KeyUsage = 0x20;
	//0x20为过滤并保留签名用法的证书，0x10为过滤并保留加密用法的证书
	certs_obj.CF_CertAlg="sm2";
	certs_obj.Quiet = 1; //zhaoxingbo 2017-07-20 去除弹出没有old值
	var ret;
	ret = certs_obj.Load();
	//证书集数量检查
	if(certs_obj.Size < 1){
		certs_obj.CryptoInterface=2;
		certs_obj.CF_KeyUsage = 0x20;
		certs_obj.CF_CertAlg="rsa";
		certs_obj.Quiet = 1; //zhaoxingbo 2017-07-20 去除弹出没有old值
		ret = certs_obj.Load();
	}
	//返回值检查
	if(ret != 0){
		alert("加载证书集失败，错误码【" + ret + "】");
	}
	//证书集数量检查
	if(certs_obj.Size < 1){
		alert("加载证书集失败，没有找到符合要求的证书");
	}
	return certs_obj;
}

function getCert_obj(certs_obj){
	if(cert_obj){
		return cert_obj;
	}else{
		//3.获取需要的证书对象和证书信息
		//var cert_obj;
		cert_obj = certs_obj.SelectCertificateDialog();
		//SelectCertificateDialog为有多个时弹窗选择，GetAt(i)为取第i个证书，Find(x)为查找指纹码为x的那张证书
		//错误码检查
		if(certs_obj.LastError != 0){
			alert("选择证书失败，错误码【" + certs_obj.LastError + "】");
		}
		return cert_obj;
	}
}

/**
 * 校验是天威ca还是湖北ca
 * return 0:无任何证书  1：天威  2：湖北
 */
function checkCAType(){
	try{
		//天威ca 该方法不报错说明有插入天威证书
		var TopCACtrl = getTopESAC();
		var stCert = TopCACtrl.SE_GetCert(1);
		if (stCert != "")
		{
			return 1;
		}
	}catch(e){
		//获取天威ca证书失败
	}
	
	try{
		//湖北ca
		/*var ClientSDK = document.getElementById("ClientSDK");
		var Cert = ClientSDK.ZL_GetCert(1);
		if (isNotBlankCheckCA(Cert)) {
			return 2;
		}*/
		getCerts_obj();
		getCert_obj(certs_obj);
		var CAType = "";
		var iss = cert_obj.Issuer;
		if(isNotBlank(iss)){
			if(iss.indexOf("CN=SHECA") >= 0){
				return 3;
			}else if(iss.indexOf("CN=CFCA") >= 0){
				return 4;
			}
		}
		var certArr = cert_obj.Issuer.split(",");
		for(var i=0; i<certArr.length; i++ ){
			var strTmp = $.trim(certArr[i]);
			if(strTmp.indexOf("CN=") == 0){
				CAType = strTmp.substring(strTmp.indexOf("CN=")+3); //ca类型
			}
		}
		
		if(isNotBlankCheckCA(CAType) && (CAType == "HBCA" || CAType == "SM2RootCA" || CAType == "RSARootCA")){
			return 2;
		}
	}catch(e){
		//获取湖北ca证书失败
	}
	return 0;
}

/**
 * 获取天威ca证书信息
 * return false 获取证书失败
 * return resultObj
	resultObj["Cert"] = stCert;
	resultObj["ZhuTi"] = stCertInfo;
	resultObj["CAType"] = CAType;//证书类型
	resultObj["CACorp"] = CACorp;//组织机构代码或身份证号
	resultObj["CAName"] = CAName;//企业名称
	resultObj["XuLieHao"] = usbkeySequence;//证书序列号
	resultObj["BeginDate"] = begin_Date;//begin_Date
	resultObj["EndDate"] = end_Date;//end_Date
 * 
 */
function getTianWeiCaInfo(){
	var resultObj = {};
	
	var TopCACtrl = getTopESAC();
	
	var stCert = TopCACtrl.SE_GetCert(1);
	if (stCert == "")
	{
		alert("请插上天威证书！");
		return false;
	}
	//获取证书信息
	var stCertInfo = TopCACtrl.SE_GetCertInfo(stCert, 20);
	if (isBlankCheckCA(stCertInfo)){
		alert("获取天威证书信息失败！");
		return false;
	}
	
	//企业信息模版（昆明）： "CN=【企业名称】,O=【组织机构代码】,ST=【省份】,C=CN"
	//自然人信息模版（昆明）： "CN=【姓名】,OU=【自然人/法定代表人/负责人/造价师】,O=【身份证号】,ST=【省份】,C=CN"
	var CACorp = TopCACtrl.SE_GetCertInfoByOid(stCert, "2.5.4.4");//组织机构代码或身份证号
	var CAName = stCertInfo.substring(stCertInfo.indexOf(", CN=") + 5); //企业名称
	var CA_OU = stCertInfo.substring(stCertInfo.indexOf("OU=") + 3, stCertInfo.indexOf(", O="));//企业编号
	var usbkeySequence = TopCACtrl.SE_GetCertInfo(stCert, 2); //证书序列号
	var begin_Date ="20"+ TopCACtrl.SE_GetCertInfo(stCert, 11).substring(0, 12); //获取起始日期（150720040353Z）
	var end_Date ="20"+ TopCACtrl.SE_GetCertInfo(stCert, 12).substring(0, 12); //获取截止日期（150720040353Z）
	var province_Name = TopCACtrl.SE_GetCertInfo(stCert, 16); //用户省份
	var city_Name = TopCACtrl.SE_GetCertInfo(stCert, 18); //用户城市
	var CAType = "";
	if(CACorp == CA_OU){
		CAType = "1"; //企业证书
	}else{
		CAType = "2"; //个人证书
	}
	
	resultObj["Cert"] = stCert;
	resultObj["ZhuTi"] = stCertInfo;
	resultObj["CAType"] = CAType;//证书类型
	resultObj["CACorp"] = CACorp;//组织机构代码或身份证号
	resultObj["CAName"] = CAName;//企业名称或人员姓名
	resultObj["XuLieHao"] = usbkeySequence;//证书序列号
	resultObj["BeginDate"] = begin_Date;//begin_Date
	resultObj["EndDate"] = end_Date;//end_Date
	return resultObj;
}

/**
 * 获取湖北ca证书信息
 * return false 获取证书失败
 * return resultObj
	resultObj["Cert"] = stCert;
	resultObj["ZhuTi"] = stCertInfo;
	resultObj["CAType"] = CAType;//证书类型  1:企业 2:个人
	resultObj["CACorp"] = CACorp;//组织机构代码或身份证号
	resultObj["CAName"] = CAName;//企业名称
	resultObj["XuLieHao"] = usbkeySequence;//证书序列号
	resultObj["BeginDate"] = begin_Date;//begin_Date
	resultObj["EndDate"] = end_Date;//end_Date
 */
function getHuBeiCaInfo(){
	/*var resultObj = {};
	//湖北ca
	var ClientSDK = document.getElementById("ClientSDK");
	var stCert = ClientSDK.ZL_GetCert(1);
	if (isBlankCheckCA(stCert)) {
		alert("请插上湖北证书！");
		return false;
	}
	
	//获取证书信息
    var strCertBase64 = stCert.split("&&&");
    var strBase64 = strCertBase64[0].split("||");
    var stCertInfo = ClientSDK.ZL_GetCertInfo(strBase64[0], 20);
    if (isBlankCheckCA(stCertInfo)) {
        alert("获取湖北证书信息失败!");
        return false;
    }
	
	// CN=工作人员一, O=鄂州市公共资源交易中心, L=鄂州, S=湖北, C=CN 
	var CAName = "";
	var certArr = stCertInfo.split(",");
	for(var i=0; i<certArr.length; i++ ){
		var strTmp = $.trim(certArr[i]);
		if(strTmp.indexOf("CN=") == 0){
			CAName = strTmp.substring(strTmp.indexOf("CN=")+3); //企业名称
		}
	}
	var usbkeySequence = ClientSDK.ZL_GetCertInfo(strBase64[0], 2);; //证书序列号
	var begin_Date = ClientSDK.ZL_GetCertInfo(stCert, 11)
			.replace(new RegExp("-","gm"),"")
			.replace(new RegExp(" ","gm"),"")
			.replace(new RegExp(":","gm"),""); //获取起始日期（150720040353Z）
	var end_Date = ClientSDK.ZL_GetCertInfo(stCert, 12)
			.replace(new RegExp("-","gm"),"")
			.replace(new RegExp(" ","gm"),"")
			.replace(new RegExp(":","gm"),""); //获取截止日期（150720040353Z）
	var province_Name = ClientSDK.ZL_GetCertInfo(stCert, 16); //用户省份
	var city_Name = ClientSDK.ZL_GetCertInfo(stCert, 18); //用户城市
	
	//企业编号
    var strCertQYBH = ClientSDK.ZL_GetCertInfoByOid(strBase64[0], "1.2.86.11.7.3");
    //身份证号
    var strCertSFZG = ClientSDK.ZL_GetCertInfoByOid(strBase64[0], "1.2.86.11.7.1");
    
	var CACorp = "";//组织机构代码或身份证号
	var CAType = "";
	if(isNotBlankCheckCA(strCertQYBH)){
		CAType = "1"; //企业证书
		CACorp = strCertQYBH;
	}else{
		CAType = "2"; //个人证书
		CACorp = strCertSFZG;
	}
	
	resultObj["Cert"] = stCert; 
	resultObj["ZhuTi"] = stCertInfo; 
	resultObj["CAType"] = CAType;//证书类型
	resultObj["CACorp"] = CACorp;//组织机构代码或身份证号
	resultObj["CAName"] = CAName;//企业名称
	resultObj["XuLieHao"] = usbkeySequence;//证书序列号 
	resultObj["BeginDate"] = begin_Date;//begin_Date  
	resultObj["EndDate"] = end_Date;//end_Date  
	return resultObj;*/
	var resultObj = {};
	//var certs_obj = getCerts_obj();
	//var cert_obj = getCert_obj(certs_obj);
	var CAName = "";
	var ectArr = cert_obj.Subject.split(",");
	var iss = cert_obj.Issuer;
	if(isNotBlank(iss)){
		if(iss.indexOf("CN=SHECA") >= 0){
			CAName = cert_obj.FriendlyName;
		}else if(iss.indexOf("CN=CFCA") >= 0){
			CAName = cert_obj.FriendlyName;
			CAName = CAName.split("@")[1];
		}else{
			for(var i=0; i<ectArr.length; i++ ){
				var strTmp = $.trim(ectArr[i]);
				if(strTmp.indexOf("CN=") == 0){
					CAName = strTmp.substring(strTmp.indexOf("CN=")+3); //企业名称
				}
			}
		}
	}
	var strCertQYBH = "";
	var strCertSFZG = "";
	var CACorp = "";//组织机构代码或身份证号
	var CAType = "";
	cert_obj.Quiet = 1; //zhaoxingbo 2017-07-20
	if(isNotBlank(iss)){
		if(iss.indexOf("CN=SHECA") >= 0){
			CAType = "1"; //企业证书
			CAName = cert_obj.FriendlyName;
			CACorp = cert_obj.GetExtensionString("1.2.156.10260.4.1.4", 0);
		}else if(iss.indexOf("CN=CFCA") >= 0){
			var a = $.trim(ectArr[1]);
			if(a.indexOf("OU=Individual") >= 0){
				CAType = "2"; //个人证书
				CACorp = cert_obj.FriendlyName.split("@")[2].substring(1);
			}else if(a.indexOf("OU=Organizational") >= 0){
				CAType = "1"; //企业证书
				CACorp = cert_obj.FriendlyName.split("@")[2].substring(1);
			}
		}else{
			//身份证号
			strCertSFZG = cert_obj.GetExtensionString("1.2.86.11.7.1", 0);
			if(isBlankCheckCA(strCertSFZG)){
				//企业编号
				strCertQYBH = cert_obj.GetExtensionString("1.2.86.11.7.3", 0);
			}
			if(isNotBlankCheckCA(strCertQYBH)){
				CAType = "1"; //企业证书
				CACorp = strCertQYBH;
			}else{
				CAType = "2"; //个人证书
				CACorp = strCertSFZG;
			}
		}
	}
   
	resultObj["Cert"] = cert_obj.Content; //Content
	resultObj["ZhuTi"] = cert_obj.Subject; //Subject
	resultObj["CAType"] = CAType;//证书类型
	resultObj["CACorp"] = CACorp;//组织机构代码或身份证号
	resultObj["CAName"] = CAName;//企业名称
	resultObj["XuLieHao"] = cert_obj.SerialNumber;//证书序列号 SerialNumber
	resultObj["BeginDate"] = cert_obj.NotBeforeTimestamp * 1000;//begin_Date NotBeforeTimestamp 
	resultObj["EndDate"] = cert_obj.NotAfterTimestamp * 1000;//end_Date NotAfterTimestamp
	return resultObj;
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

/*
 * 天威ca数据签名
 */
function signDataTianWeiCa(value, isCheckSame){
	try{
		if (isBlankCheckCA(value)) {
            alert("原文数据为空，请输入原文数据！");
            return false;
        }
		
		var TopCACtrl = getTopESAC();
		var stCert = TopCACtrl.SE_GetCert(1);
		if (stCert == "")
		{
			alert("请插入证书！");
			return false;
		}
		
		if(isBlankCheckCA(isCheckSame) || !(isCheckSame === false)){
			var stCertInfo = TopCACtrl.SE_GetCertInfoByOid(stCert, "2.5.4.4");
			if (stCertInfo == "")
			{
				alert("读取证书失败");
				return false;
			}
			if(stCertInfo != login_user_dn){
				alert("签名验证失败，不能使用其它CA签名");
				return false;
			}
		}
		
		var sSignTxt = TopCACtrl.SE_SignData(value);
		if (sSignTxt == ""){
			alert("签名失败！");
			return false;
		}
		return sSignTxt;
	}catch(e){
		alert("签名失败，请检查是否CA登录");
		return false;
	}
	return false;
}

/*
 * 湖北ca数据签名
 */
function signDataHuBeiCa(value, isCheckSame){
	/*try{
        if (isBlankCheckCA(value)) {
            alert("原文数据为空，请输入原文数据！");
            return false;
        }
        
        //获取证书
        var ClientSDK = document.getElementById("ClientSDK");
        var stCert = ClientSDK.ZL_GetCert(1);
    	if (isBlankCheckCA(stCert)) {
    		alert("请插上湖北证书！");
    		return false;
    	}
    	
    	if(isBlankCheckCA(isCheckSame) || !(isCheckSame === false)){
    		//证书信息
            var strCertBase64 = stCert.split("&&&");
            var strBase64 = strCertBase64[0].split("||");
            //企业编号
            var stCertInfo = ClientSDK.ZL_GetCertInfoByOid(strBase64[0], "1.2.86.11.7.3");
            //服务、监管系统重新获取
    		if(sub_system_id == "200" || sub_system_id == "300"){
    			//身份证号
    	        stCertInfo = ClientSDK.ZL_GetCertInfoByOid(strBase64[0], "1.2.86.11.7.1");
    			if (stCertInfo == "")
    			{
    				alert("读取证书失败");
    				return false;
    			}
    		}
    		if(isBlankCheckCA(stCertInfo)){
    			alert("读取证书信息失败");
    			return false;
    		}
        	if(stCertInfo != login_user_dn){
        		alert("签名验证失败，不能使用其它CA签名");
    			return false;
    		}
    	}
        
        var result = "";
        result = ClientSDK.ZL_SignData(value);
        if (0 == result.length) {
            alert("签名失败！");
            return false;
        }       
		return result;
	}catch(e){
		alert("签名失败，请检查是否CA登录");
		return false;
	}
	return false;*/
	try{
		debugger;
        if (isBlankCheckCA(value)) {
            alert("原文数据为空，请输入原文数据！");
            return false;
        }
        
        //获取证书
        /*var ClientSDK = document.getElementById("ClientSDK");
        var stCert = ClientSDK.ZL_GetCert(1);
    	if (isBlankCheckCA(stCert)) {
    		alert("请插上湖北证书！");
    		return false;
    	}*/
        //证书信息
        certs_obj = getCerts_obj();
        cert_obj = getCert_obj(certs_obj);
        var iss = cert_obj.Issuer;
    	if(isBlankCheckCA(isCheckSame) || !(isCheckSame === false)){
            //企业编号
    		var stCertInfo = "";
    		if(isNotBlank(iss)){
    			if(iss.indexOf("CN=SHECA") >= 0){
    				stCertInfo = cert_obj.GetExtensionString("1.2.156.10260.4.1.4", 0);
    			}else if(iss.indexOf("CN=CFCA") >= 0){
    				stCertInfo = cert_obj.FriendlyName.split("@")[2].substring(1);
    			}else{
    				stCertInfo = cert_obj.GetExtensionString("1.2.86.11.7.3", 0);
    			}
    		}
            
            //服务、监管系统重新获取
    		if(sub_system_id == "200" || sub_system_id == "300"){
    			//身份证号
    			if(isNotBlank(iss)){
        			if(iss.indexOf("CN=CFCA") >= 0){
        				stCertInfo = cert_obj.FriendlyName.split("@")[2].substring(1);
        			}else{
        				stCertInfo = cert_obj.GetExtensionString("1.2.86.11.7.1", 0);
        			}
        		}
    	        
    			if (stCertInfo == "")
    			{
    				alert("读取证书失败");
    				return false;
    			}
    		}
    		if(isBlankCheckCA(stCertInfo)){
    			alert("读取证书信息失败");
    			return false;
    		}
        	if(stCertInfo != login_user_dn){
        		alert("签名验证失败，不能使用其它CA签名");
    			return false;
    		}
    	}
    	//var pin = prompt("请输入使用签名密钥对需要的设备PIN码","");
    	//后面的11111111为未输入pin时的默认pin
    	cert_obj.UserPIN = "";
    	var strpkcs7signature = cert_obj.PKCS7String(value, 0);
    	//请自行将字符串"1234567890"替换成需要签名的原文
    	//第二参数的1为不附加原文的detached方式，0为附加原文的attached方式
    	if(cert_obj.LastError != 0){//错误码检查
    		alert("签名失败，错误码【" + cert_obj.LastError + "】");
    		return false;  //zhaoxingbo 2017-07-20 新加,防止浏览器崩溃
    	}
    	//alert("PKCS7方式签名值为" + strpkcs7signature);
    	var ret;
    	ret = cert_obj.PKCS7Verify(value, strpkcs7signature);
    	//请自行将字符串"1234567890"替换成需要验签的原文
    	//如果签名时采取了附加原文的attached方式，那么前面的原文可以传入空字符串
    	if(ret != 0){//错误码检查
    		return false;
    		alert("验签失败，错误码【" + ret + "】");
    	}else{
    		return strpkcs7signature;
    	}
    	//alert("PKCS7方式验签成功");
		
    	
    	/*var pin=prompt("请输入使用签名密钥对需要的设备PIN码","");
    	//后面的11111111为未输入pin时的默认pin
    	cert_obj.UserPIN = pin;
    	var strpkcs1signature = cert_obj.PKCS1String(value);
    	//请自行将字符串"1234567890"替换成需要签名的原文
    	if(cert_obj.LastError != 0)//错误码检查
    	{
    		alert("签名失败，错误码【"+cert_obj.LastError+"】");
    	}
    	alert("PKCS1方式签名值为"+strpkcs1signature);
    	var ret;
    	ret = cert_obj.PKCS1Verify(strpkcs1signature, value);
    	//请自行将字符串"1234567890"替换成需要验签的原文
    	if(ret != 0){ //错误码检查
    		alert("验签失败，错误码【"+ret+"】");
    	}else{
    		console.log(strpkcs1signature)
    		return strpkcs1signature;
    	}
    	//alert("PKCS1方式验签成功");*/ 
    	return result;
	}catch(e){
		alert("签名失败，请检查是否CA登录");
		return false;
	}
	return false;
}

function isNotBlankCheckCA(value){
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
function isBlankCheckCA(value){
	return !isNotBlankCheckCA(value);
}
