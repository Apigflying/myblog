import Cookies from 'js-cookie'
import crypto from 'crypto';
const TokenKey = 'Admin-Token'

export function md5 (password) {
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
