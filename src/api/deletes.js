import fetch from 'utils/fetch'
const method = 'POST'
const proxy = '/deletes'

export function deleteArticleById(data){
  return fetch({
    method,
    url:`${proxy}/deleteArticleById`,
    data
  })
}
// 删除评论
export function deleteCommentById(data){
  return fetch({
    method,
    url:`${proxy}/deleteCommentById`,
    data
  })
}
// 删除子评论
export function deleteSubComment(data){
  return fetch({
    method,
    url:`${proxy}/deleteSubComment`,
    data
  })
}
