//全局钩子函数
export async function global(to, from, next) {
  // let {
  //   data: openIdData
  // } = await getOpenId()
  // config.openId = openIdData.content
  next()
}

export function afterEach(to, from) {
  setTimeout(() => {
    var _hmt = _hmt || [];
    (function () {
      //每次执行前，先移除上次插入的代码
      document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?8c61e7044e991bbed80f0d36e0348d2b";
      hm.id = "baidu_tj"
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  }, 0);
}
