/**附原文的数据签名
**dateTime:2008/8/15 19:00
**param: strData 字符数据
**return: 字符串
**description:对字符数据进行签名，若成功，返回签名后密文字符串，若失败，返回空("")。
*/
function AttachSign(strData)
{
    var SZCAOcx = document.getElementById("SZCAOcx");
    var result = SZCAOcx.AxSign(strData);
    var verifyResult = SZCAOcx.AxVerify(result);
	if(SZCAOcx.AxGetErrorCode() != "")
	{
		//alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
		result = "";
	}
    
    if(result=="")
    {	
	    alert("签名验证失败");
		return "";
    }
    else
    {
    	return result;
    }
}

/**选择签名证书
**dateTime:2008/8/18 18:20
**param: 
**return: 字符串
**description:选择一个签名证书，若成功，返回证书DN信息，若失败，返回空("")。
*/
function GetKeyInfo() 
{
    var keyInfo = {};
    keyInfo.CertTitle = "";
    keyInfo.SN = "";
    keyInfo.CertBase64 = "";
    keyInfo.SignInfo = "";
    
    //var strFilter = "SC;SZCA;#;#;1.2.86.11.7.7550201:Organizational";
    // SZCAOcx.AxSetCertFilterStr(strFilter );
    //SetCertFilter(1,0);
    var SZCAOcx = document.getElementById("SZCAOcx");
    
    var result = SZCAOcx.AxSetKeyStore();
    //Alert("AxSetKeyStore() = " + result);
    //if(!result||DebugError("AxSetKeyStore()"))
    if (!result)
    {
        return keyInfo;
    }
    else 
    {
        var cert_Dn = SZCAOcx.AxGetCertInfo("DN") ;
        var sn = SZCAOcx.AxGetCertInfo("SN");
        var signInfo = AttachSign("LoginCheck");
        var result1 = SZCAOcx.AxVerify(signInfo);
        var certBase64 = SZCAOcx.AxGetCertData();
        if ( signInfo != "")
        {
            keyInfo.CertTitle = cert_Dn;
            keyInfo.SN = sn;
            keyInfo.CertBase64 = certBase64;
            keyInfo.SignInfo = signInfo;

            return keyInfo;
        }
        else 
        {
         return keyInfo;
        }
    }
}

function UpFileCheck() {
    var strDN = GetKeyInfo();
    return strDN.CertTitle;

}

//设置证书过滤情况：  AKeyType --1-机构证书， 2-业务证书，4-个人证书， 1+2， 1+2+4, 2+4
//AUsage--用途：0-签名，1-加密
//"SC;SZCA;#;#;1.2.86.11.7.7550201:Organizational;";
//"SC;SZCA;#;#;1.2.86.11.7.7550202:SZJS;";          //表示深圳建设局采用的证书系列

//加密的话，用'EC;....' ;
//strFilter := 'SV;#;建设局;#;1.2.86.11.7.7550201:Organizational;';
function SetCertFilter(AKeyType,AUsage)
{
  var strFilter;
  /*var strUsage;
  //这个是专用模板的证书,只要是1.2.86.11.7.7550201:Personal这种类型,都是SZJS的
  switch (AUsage)
  {
    case 0:
        strUsage="SC";
        break;
    case 1:
        strUsage="EC";
  }

  switch (AKeyType)
  {
    case 1:
        strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Organizational";
        break;
    case 2:
        strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Business";
        break;
    case 3://1+2  1-机构证书， 2-业务证书 两种组合
        strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:i";      //组合的，待做
        //strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Organizational|Business,1.2.86.11.7.7550202:SZJS";
        break;
    case 4:
        strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Personal";
        break;
    case 5://5 留给专家证书使用
    	strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:EXPERT"; //专家
    	break;
    case 6:
        strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:User"; 	//2014-09-15 liaochx 新加的证书
        break;
    default:
        strFilter = ";SZCA;#;#;1.2.86.11.7.7550202:SZJS";
  }*/

  strFilter = getCertFilterStr(AKeyType,AUsage);
  var SZCAOcx = document.getElementById("SZCAOcx");
  SZCAOcx.AxSetCertFilterStr(strFilter );
}

function getCertFilterStr(AKeyType,AUsage){
	var strFilter;
	var strUsage;
	//这个是专用模板的证书,只要是1.2.86.11.7.7550201:Personal这种类型,都是SZJS的
	switch (AUsage)
	{
		case 0:
			strUsage="SC";
			break;
		case 1:
			strUsage="EC";
	}
	
	switch (AKeyType)
	{
		case 1:
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Organizational";
			break;
		case 2:
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Business";
			break;
		case 3://1+2  1-机构证书， 2-业务证书 两种组合
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:i";      //组合的，待做
			//strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Organizational|Business,1.2.86.11.7.7550202:SZJS";
			break;
		case 4:
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:Personal";
			break;
		case 5://5 留给专家证书使用
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:EXPERT"; //专家
			break;
		case 6:
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550201:User"; 	//2014-09-15 liaochx 新加的证书
			break;
		default:
			strFilter = ";SZCA;#;#;1.2.86.11.7.7550202:SZJS";
	}
	
	strFilter = strUsage + strFilter;
	
	return strFilter;
}
