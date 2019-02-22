String.prototype.isEmpty = function(){return /^\s*$/.test(this);} 
String.prototype.Trim  = function(){return this.replace(/(^\s*)|(\s*$)/g, "");}
function CheckCertByRoot(cert,root)
{

	result = SZCAOcx.AxCheckByRootEx(cert, root);
                   
                    if (result)
                    {
                        return "该证书由指定根证签发";
                    }
                    else
                    {
                        return "该证书不由指定根证签发";
                    }
}

function CheckCertByCrl(crl)
{
	var Sn = SZCAOcx.AxGetCertInfo("SN");

	result = SZCAOcx.AxCheckByCrlEx(Sn, crl);
                   
                    if (!result)
                    {
                        return "该证书已过期";
                    }
                    else
                    {
                        return "该证书不在过期列表内";
                    }
}
//用户选择证书登录

//选择签名证书
function GetSignCertificate()
{
    var SZCAOcx = document.getElementById("SZCAOcx");
  	var result=SZCAOcx.AxSetKeyStore(); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		//alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
  	/*if(SZCAOcx.AxGetErrorCode()!="")
  	{
  		alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg()); 
  		return ""; 
  	}
  	var certSubject = SZCAOcx.AxGetCertInfo("SN");	
  	return certSubject;*/
}
function GetSignCertificateEx(cert)
{
    var pas=prompt("请输入密码");
	//alert(pas);
  	var result=SZCAOcx.AxSetKeyEx(cert,pas); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
  
}
//选择加密证书
function GetEncryptCertificate()
{
	SZCAOcx.AxInit();
  	var result=SZCAOcx.AxSetCertStore(); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
}
function GetEncryptCertificateEx(cert)
{
	//alert(cert);
  	var result=SZCAOcx.AxSetCertEx(cert); 	
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
}
//选择解密证书
function GetDecryptCertificate()
{
  	SZCAOcx.SetCertChooseType(1); 
  	SZCAOcx.SetCert("DC","","","","","");
  	if(SZCAOcx.GetErrorCode()!=0)
  	{
  		alert("错误码："+SZCAOcx.GetErrorCode()+" 错误信息："+SZCAOcx.GetErrorMessage()); 
  		return ""; 
  	}
  	var certSubject = SZCAOcx.getCertInfo("DC",0,"");	
  	return certSubject;
}

//不附原文的签名
function DetachSign(certDN,strData)
{
    var result = SZCAOcx.DetachSign(certDN,strData);     
    if(SZCAOcx.GetErrorCode()!=0)
    {		
			alert("错误码："+SZCAOcx.GetErrorCode()+" 错误信息："+SZCAOcx.GetErrorMessage());
			return "";
    }
    else
    {
    	return result;
    }
}

//验证签名
function ValidataDSign(signedData,originData)
{
			var result;			
			SZCAOcx.verifyDetachedSign(signedData,originData);
			if(SZCAOcx.GetErrorCode()!=0)
			{
					alert("错误码："+SZCAOcx.GetErrorCode()+" 错误信息："+SZCAOcx.GetErrorMessage());
			}
			else
			{
				result = GerCerInfo();	
			}
			return result;		
}

//附原文的签名
function AttachSign(strData)
{
    var SZCAOcx = document.getElementById("SZCAOcx");
    var result = SZCAOcx.AxSign(strData);
    if(SZCAOcx.AxGetErrorCode()!="")
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return result;
    }
}
function AttachSign2()
{
    var result = SZCAOcx.AxSign2Final();
    if(SZCAOcx.AxGetErrorCode()!="")
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return result;
    }
}
function AttachSignEx(strData)
{
    var result = SZCAOcx.AxSignEx(strData,strData+".p7s");
    if(SZCAOcx.AxGetErrorCode()!="")
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return strData+".p7s";
    }
}
//验证签名
function VerifyAttachedSign(signedData)
{
    var SZCAOcx = document.getElementById("SZCAOcx");
    var result1,re;			
	result1=SZCAOcx.AxVerify(signedData);
	//alert(SZCAOcx.AxVerify(signedData));
	if(SZCAOcx.AxGetErrorCode()!="")
	{
		alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
	}
	else
	{
		re =GerCerInfo() + "<br> 原文：" +result1;		
	}
	return re;		
}
function VerifyAttachedSign2(signedData)
{
	var result1,re;			
	result1=SZCAOcx.AxVerify(signedData);
	
	//alert(SZCAOcx.AxVerify(signedData));
	if(SZCAOcx.AxGetErrorCode()!="")
	{
		alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
	}
	else
	{
		re =GerCerInfo2() + "<br> 原文：" +result1;		
	}
	return re;		
}
function VerifyAttachedSignEx(signedData)
{
	var result1,re;			
	result1=SZCAOcx.AxVerifyEx(signedData,signedData+".new");
	//alert(SZCAOcx.AxVerify(signedData));
	if(SZCAOcx.AxGetErrorCode()!="")
	{
		alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
	}
	else
	{
		re =GerCerInfo() + "<br> 原文：" +signedData+".new";		
	}
	return re;		
}

//制作数字信封
function EnvelopData(strData)
{
	//alert(strData);
    var result = SZCAOcx.AxEnvelop(strData);     
	//alert(result);
    if(SZCAOcx.AxGetErrorCode()!=0)
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return result;
    }
}
function EnvelopDataEx(strData)
{
	//alert(strData);
    var result = SZCAOcx.AxEnvelopEx(strData,strData+".p7n");     
	//alert(result);
    if(SZCAOcx.AxGetErrorCode()!=0)
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return strData+".p7n";
    }
}

//解密数字信封
function DecryptEnvelopData(encryptedData)
{
	var result;	
	SZCAOcx.AxSetKeyStore();
	result=SZCAOcx.AxDecode(encryptedData);
	if(SZCAOcx.AxGetErrorCode()!=0)
	{
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
	}
	
	return result;		
}
function DecryptEnvelopDataEx(encryptedData)
{
	var result;	
	SZCAOcx.AxSetKeyStore();
	result=SZCAOcx.AxDecodeEx(encryptedData,encryptedData+".new");
	if(SZCAOcx.AxGetErrorCode()!=0)
	{
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
	}
	
	return encryptedData+".new";		
}

//制作带签名的数字信封
function SignedEnvelopData(signCertDN,encryptCertDN,strData)
{
    var result = SZCAOcx.CreateSignedEnvelop(signCertDN,encryptCertDN,strData);     
    if(SZCAOcx.GetErrorCode()!=0)
    {		
			alert("错误码："+SZCAOcx.GetErrorCode()+" 错误信息："+SZCAOcx.GetErrorMessage());
			return "";
    }
    else
    {
    	return result;
    }
}

//解密带签名的数字信封
function DecryptSignedEnvelopData(signedData)
{
	var result;			
	SZCAOcx.VerifySignedEnvelop(signedData);
	if(SZCAOcx.GetErrorCode()!=0)
	{
			alert("错误码："+SZCAOcx.GetErrorCode()+" 错误信息："+SZCAOcx.GetErrorMessage());
	}
	else
	{
		result = GerCerInfo() + ";<br>" +
		"原文：" + SZCAOcx.GetData();	
	}
	return result;		
}

//获取证书信息
function GerCerInfo()
{
    var SZCAOcx = document.getElementById("SZCAOcx");
	return "验证成功。<br>"+
		"版本号： " + SZCAOcx.AxGetCertInfo("VER") + ";<br>" +
        "序列号： " + SZCAOcx.AxGetCertInfo("SN") + ";<br>" +
        "证书主题： " + SZCAOcx.AxGetCertInfo("DN") + ";<br>" +
        "有效起始日期： " + SZCAOcx.AxGetCertInfo("TIMEB") + ";<br>" +
        "有效终止日期： " + SZCAOcx.AxGetCertInfo("TIMEE") + ";<br>" +
        "颁发者主题： " + SZCAOcx.AxGetCertInfo("ISSUER") + ";<br>";	
}

function GerCerInfo2()
{
	var snList = SZCAOcx.AxGetSnList();
	
	var sl=snList.split(";");
	
	var result="验证成功。<br>";
	for(i=0;i<sl.length;i++)
	{
		if(sl[i]=="")
		{
			continue;
		}
		result+="版本号： " + SZCAOcx.AxGetCertInfoBySn(sl[i],"VER") + ";<br>" +
        "序列号： " + SZCAOcx.AxGetCertInfoBySn(sl[i],"SN") + ";<br>" +
        "证书主题： " + SZCAOcx.AxGetCertInfoBySn(sl[i],"DN") + ";<br>" +
        "有效起始日期： " + SZCAOcx.AxGetCertInfoBySn(sl[i],"TIMEB") + ";<br>" +
        "有效终止日期： " + SZCAOcx.AxGetCertInfoBySn(sl[i],"TIMEE") + ";<br>" +
        "颁发者主题： " + SZCAOcx.AxGetCertInfoBySn(sl[i],"ISSUER") + ";<br>";	
	}
	return result;
}



//author:wenming
//多人加密
function multEncode(encodeData){
	var result = SZCAOcx.AxEnvelop2Final(encodeData);
	//alert("result："+result);
	if(SZCAOcx.AxGetErrorCode()!="")
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return result;
    }
}
////author:wenming
//解密
function multDecode(decodeData){
	//alert("decodeData:"+decodeData);
	SZCAOcx.AxSetKeyStore();
	var result = SZCAOcx.AxDecode(decodeData);
	//alert(result);
		return result;
	}
function GetEncodeCertificate()
{
  	var result=SZCAOcx.AxSetCertStore(); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
}
////author:wenming
//文件加密
function multEncodeFile(infile,outfile){
	var result = SZCAOcx.AxEnvelop2FinalEx(infile,outfile);
	//alert("result："+result);
	if(SZCAOcx.AxGetErrorCode()!="")
    {		
			alert("错误码："+SZCAOcx.AxGetErrorCode()+" 错误信息："+SZCAOcx.AxGetErrorMsg());
			return "";
    }
    else
    {
    	return result;
    }
	}
////author:wenming
//文件解密
function multDecodeFile(infile,outfile){
	SZCAOcx.AxSetCertFilterStr('EC;SZCA;#;#;#;');
	SZCAOcx.AxSetKeyStore();
	var result = SZCAOcx.AxDecodeEx(infile,outfile);
	//alert(result);
		return result;
	}
function GetEnodeCertificate()
{
	SZCAOcx.AxEnvelop2InitEx();
  	var result=SZCAOcx.AxSetCertStore(); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
}
function GetEnodeCertificate1()
{
  	var result=SZCAOcx.AxSetCertStore(); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
}
function GetEncodeFileCertificate()
{
	
  	SZCAOcx.AxSetCertFilterStr('EC;SZCA;#;#;#;');
  	var result=SZCAOcx.AxSetCertStore(); 
	if(result)
	{
  		return SZCAOcx.AxGetCertInfo("DN");
	}
	else
	{
		alert(SZCAOcx.AxGetErrorCode());
		return "";
	}
}
//获取证书信息
function getInfo()
{
	return "<br>"+
		"版本号： " + SZCAOcx.AxGetCertInfo("VER") + ";<br>" +
        "序列号： " + SZCAOcx.AxGetCertInfo("SN") + ";<br>" +
        "证书主题： " + SZCAOcx.AxGetCertInfo("DN") + ";<br>" +
        "有效起始日期： " + SZCAOcx.AxGetCertInfo("TIMEB") + ";<br>" +
        "有效终止日期： " + SZCAOcx.AxGetCertInfo("TIMEE") + ";<br>" +
        "颁发者主题： " + SZCAOcx.AxGetCertInfo("ISSUER") + ";<br>";	
}




