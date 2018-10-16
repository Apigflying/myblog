import fetch from 'utils/fetch';
import qs from 'qs';
const method = 'GET';
const proxy = '/getData';


export function getUploadToken(){
  return fetch({
    method:'GET',
    url:`${proxy}/getUploadToken`
  })
}

// 获取所有文章列表
export function getArticleList(data){
  let query = qs.stringify(data);
  return fetch({
    method,
    url:`${proxy}/getArticleList/?${query}`,
  })
}
// 通过文章id 查看文章详情
export function getArticleById(id){
  return fetch({
    method,
    url:`${proxy}/getArticleById?id=${id}`,
  })
}
// 获取文章评论
export function getArticleCommentById(id){
  return fetch({
    method,
    url:`${proxy}/getArticleCommentById?id=${id}`,
  })
}

// 获取文章子评论
export function getSubCommentById(data){
  return fetch({
    method:'POST',
    url:`${proxy}/getSubCommentById`,
    data
  })
}
// 获取用户所有创建的文章
export function getUserArticles(){
  return fetch({
    method:'POST',
    url:`${proxy}/getUserArticles`
  })
}
// 获取用户天气信息
export function getUserWeather(ip){
  return fetch({
    method,
    url:`${proxy}/getUserWeather?ip=${ip}`
  })
}
