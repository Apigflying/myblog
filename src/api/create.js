import fetch from 'utils/fetch'
const method = 'POST'
const proxy = '/create'

export function createArticleIntroduce(data){
  return fetch({
    method,
    url:`${proxy}/createArticleIntroduce`,
    data
  })
}
export function createArticleContent(data){
  return fetch({
    method,
    url:`${proxy}/createArticleContent`,
    data
  })
}
export function createArticleComment(data){
  return fetch({
    method,
    url:`${proxy}/createArticleComment`,
    data
  })
}

export function setPraise(data){
  return fetch({
    method,
    url:`${proxy}/setPraise`,
    data
  })
}
export function createSubComment(data){
  return fetch({
    method,
    url:`${proxy}/createSubComment`,
    data
  })
}
