//全局钩子函数
export async function global (to, from, next) {
  // let {
  //   data: openIdData
  // } = await getOpenId()
  // config.openId = openIdData.content
  next()
}

export function beforeEach (to, from, next){
  if (to.path) window._hmt.push(['_trackPageview', '/#' + to.fullPath])
  next()
}
