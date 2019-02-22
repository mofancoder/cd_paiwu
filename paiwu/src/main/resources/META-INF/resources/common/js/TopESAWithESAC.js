function getTopESAC() {
    return CPlugin.getInstance().getESAC()
}
var CPlugin = function() {
    var b, a;
    function m(a) {
        b = {};
        b.certkitClsID = void 0 !== a.certkitClsID ? a.certkitClsID: "75CA432B-B39B-4835-BB8E-3220E1AB1B8E";
        b.certkitPrgID = void 0 !== a.certkitPrgID ? a.certkitPrgID: "TopCertKitTRUELORE.CertKit.Version.1";
        b.certkitVer = void 0 !== a.certkitVer ? a.certKitVer: "0,0,0,1004"
    }
    var l = null;
    a = b = void 0;
    b = a = null;
    m({});
    var n = function() {
        this.getESAC = function() {
            if (null === a || void 0 === a) throw TCACErr.newError(4278192383, "\u672a\u80fd\u52a0\u8f7d\u5ba2\u6237\u7aef\u7ec4\u4ef6");
            return a
        }
    };
    return {
        getInstance: function(h) {
            void 0 !== h && m(h);
            if (!l) {
                var e;
                h = navigator.userAgent;
                if (0 < h.indexOf("MSIE") || -1 < h.toLocaleLowerCase().indexOf("trident")) try {
                    var f = "<object id='CertKit' classid='clsid:" + b.certkitClsID + "' ",
                    f = f + "></object>",
                    d = document.getElementById("CertKitDiv");
                    if (null === d || "" === d) d = document.createElement("div"),
                    d.setAttribute("id", "CertKitDiv"),
                    document.body.appendChild(d),
                    d.innerHTML = f;
                    e = document.getElementById("CertKit")
                } catch(p) {
                    console.log(p)
                	e = null
                } else try {
                    for (var c = "<embed id='CertKit' type='application/" + b.certkitPrgID + "' width='0' height='0'></embed>",
                    k = navigator.plugins.length,
                    f = null,
                    d = 0; d < k; d++) if ( - 1 < navigator.plugins[d].name.indexOf("TopCertKit")) {
                        var g = document.getElementById("CertKitDiv");
                        if (null === g || "" === g) g = document.createElement("div"),
                        g.setAttribute("id", "CertKitDiv"),
                        document.body.appendChild(g),
                        g.innerHTML = c;
                        f = document.getElementById("CertKit");
                        break
                    }
                    e = f
                } catch(q) {
                	console.log(q);
                    e = null
                } (c = null == e) || (c = null, c = b.certkitVer.split(","), k = (parseInt(c[0]) << 24) + (parseInt(c[1]) << 16) + (parseInt(c[2]) << 8) + parseInt(c[3]), c = e.Version, c = void 0 == (c == k ? 0 : c < k ? -1 : c > k ? 1 : void 0));
                if (c) throw TCACErr.newError(4278192127, "\u672a\u80fd\u52a0\u8f7d\u5ba2\u6237\u7aef\u7ec4\u4ef6");
                a = e.GetTopESAC();
                l = new n
            }
            return l
        }
    }
} ();
function TCACErr() {
    this._errarr = [];
    this.addError = function(b, a) {
        this.number = 0 < b ? b: 4294967296 + b;
        this.description = a;
        this._errarr.push({
            code: this.number.toString(16),
            msg: a
        });
        return this
    };
    this.toStr = function() {
        for (var b = "",
        a = 0; a < this._errarr.length; a++) b += this._errarr[a].msg + "   \u9519\u8bef\u7801\uff1a0x" + this._errarr[a].code + ", ";
        return b.substr(0, b.length - 2)
    }
}
TCACErr.prototype = Error();
TCACErr.newError = function(b, a) {
    return (new TCACErr).addError(b, a)
};