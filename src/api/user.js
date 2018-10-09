import fetch from 'utils/fetch'
const method = 'POST';
const proxy = '/user';
// 用户名密码登录
export function loginByUserName (data) {
  return fetch({
    method,
    url: `${ proxy }/loginByUserName`,
    data
  })
}
// 注册成为用户
export const signUp = (data) => {
  return fetch({
    method,
    url: `${ proxy }/signUp`,
    data
  })
}
// 获取用户信息
export const getUserInfo = () => {
  return fetch({
    method,
    url: `${ proxy }/getUserInfo`
  })
}

export const updateUserMessage = (data) => {
  return fetch({
    method,
    url: `${ proxy }/updateUserMessage`,
    data
  })
}
