/* 工具函数 */

/*-----------------------------------*\
  beauty annotation
\*-----------------------------------*/

/*
编码函数      escape   ,   encodeURI  ,   encodeURIComponent
解码函数：unescape  ,   decodeURI  ,   decodeURIComponent

进行url跳转时可以整体使用encodeURI，可以将汉字进行转码
window.locaiton.href=encodeURI("http://cang.baidu.com/do/s?word=百度&ct=21");
encodeURI("http://cang.baidu.com/do/s?word=百度&ct=21") -> "http://cang.baidu.com/do/s?word=%E7%99%BE%E5%BA%A6&ct=21"
decodeURI("http://cang.baidu.com/do/s?word=%E7%99%BE%E5%BA%A6&ct=21") -> "http://cang.baidu.com/do/s?word=百度&ct=21"

escape不编码字符有69个：*，+，-，.，/，@，_，0-9，a-z，A-Z
encodeURI不编码字符有82个：!，#，$，&，'，(，)，*，+，,，-，.，/，:，;，=，?，@，_，~，0-9，a-z，A-Z
encodeURIComponent不编码字符有71个：!， '，(，)，*，-，.，_，~，0-9，a-z，A-Z
*/
var tools = {};
//传入window.location.href或者window.location.search都可以
tools.querySearch = search => {
  if (!!search && typeof search == "string") {
    let rstObj = {};
    /* 如果以？开头，说明是search，如果不以？开头，就从第一个问号开始隔断 */
    let searchArr =
      search[0] !== "?"
        ? search.substr(search.indexOf("?") + 1).split("&")
        : search.substr(1).split("&");
    searchArr.forEach((each, index) => {
      let item = each.split("=");
      if (each.indexOf("=") != -1) {
        rstObj[item[0].trim()] = item[1].trim();
      } else {
        console.error(`第${index + 1}项没有=,无法分割`);
      }
    });
    return rstObj;
  } else {
    console.error("传入的不是字符串");
    return undefined;
  }
};
//数组对象深拷贝
tools.deepCopy = source => {
  var result;
  source instanceof Array ? (result = []) : (result = {});

  for (var key in source) {
    result[key] =
      typeof source[key] === "object"
        ? this.deepCopy(source[key])
        : source[key];
  }
  return result;
};
//判断是否是在PC端，如果是，返回true
tools.isPC = () => {
  var userAgentInfo = window.navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};
//判断是否是微信内置浏览器
tools.isWX = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};
//设置cookie
tools.setCookie = (name, value) => {
  var Days = 30; /* 设置cookie保存时间 */
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};
//获取cookie
tools.getCookie = name => {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2]);
  } else {
    /* 如果没有参数，那么就获取本域下的所有cookie */
    return document.cookie;
  }
};
/*
   解析cookie
   格式为：
   "BAIDUID=84010C5D99B330DFF6E5DE339C5B46A5:FG=1; PSTM=1506002955; BIDUPSID=50EB351368264907701A48B60DE2D43F"
  */
tools.queryCookie = str => {
  if (typeof str == "string") {
    if (str.indexOf(";") > -1) {
      const obj = {};
      str.split(";").forEach((item, index) => {
        if (item.indexOf("=") > -1) {
          obj[item.split("=")[0].trim()] = item.substr(item.indexOf("=") + 1);
        } else {
          console.error(`第${index + 1}项不使用=分割`);
        }
      });
      return obj;
    } else {
      console.error('cookie内没有";"');
    }
  } else {
    console.error("传入的不是字符串");
  }
};
//获取本地存储
tools.getStorage = key => {
  const re = /^\[|\{|\}|\]$/g; //判断字符中是否有[]{}
  let getIt = localStorage.getItem(key);
  if (re.test(getIt)) {
    return JSON.parse(getIt);
  } else {
    return getIt;
  }
};
//设置本地存储
tools.setStorage = (key, val) => {
  if (typeof val == "string") {
    //如果传过来的是字符串，那么说明要保存的是id
    localStorage.setItem(key, val);
  } else {
    //如果传过来的不是字符串，要保存数组
    localStorage.setItem(key, JSON.stringify(val));
  }
};
//验证是不是手机号码
//如果是手机号码，那么就返回这个号码，如果不是，返回false
//tools.verifyPhone(this.userPhone) || Toast('电话号码格式不正确')
tools.verifyPhone = val => {
  const re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  return re.test(val) ? val : false;
};
//时间转换
//将传过来的时间戳变为"2017.09.01 15:04:01"
tools.redate = (date, pattern = "yyyy-MM-dd") => {
  let fmt = pattern;
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
//补零函数
tools.add0 = num => {
  return num < 10 ? "0" + num : "" + num;
};
//根据坐标计算两点距离(单位M,修正公式)
//lat 纬度 		lng 经度
tools.getDistance = (lat1, lng1, lat2, lng2) => {
  const EARTH_RADIUS = 6378137.0; //单位M
  const PI = Math.PI;
  let getRad = d => d * PI / 180;
  let f = getRad((lat1 + lat2) / 2);
  let g = getRad((lat1 - lat2) / 2);
  let l = getRad((lng1 - lng2) / 2);
  let sg = Math.sin(g);
  let sl = Math.sin(l);
  let sf = Math.sin(f);
  let s, c, w, r, d, h1, h2;
  let a = EARTH_RADIUS;
  let fl = 1 / 298.257;
  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;
  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;
  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
};

tools.getStyle = (element, attr, NumberMode = "int") => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === "scrollTop") {
    target = element.scrollTop;
  } else if (element.currentStyle) {
    target = element.currentStyle[attr];
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == "float" ? parseFloat(target) : parseInt(target);
};
tools.debounce = function(fn, interval) {
    var timer, isFirst = true;
    return function() {
        var args = arguments,
            _me = this;
        if(isFirst) {
            fn.apply(_me, args);
            return isFirst = false;
        }
        console.log(timer)
        if(timer) {
            return false
        }
        timer = setTimeout(function() {
            clearTimeout(timer);
            timer = null;
            fn.apply(_me, args)
        }, interval || 500)
    }
}
export default tools;
