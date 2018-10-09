import fetch from 'utils/fetch'
const method = 'GET'
const proxy = '/test'

export function getData(search){
  return fetch({
    method,
    url:`${proxy}/getData?search=${search}`
  })
}

export function getTotal(){
  return fetch({
    method,
    url:`${proxy}/getTotal`
  })
}

export function getScatterData(){
  return fetch({
    method,
    url:`${proxy}/getScatterData`
  })
}
export function getLineData(){
  return fetch({
    method,
    url:`${proxy}/getLineData`
  })
}

export function downloadfile(){
  return fetch({
    method,
    url:`${proxy}/download`,
    responseType: 'blob'
  })
}


export function testAuthToken(){
  return fetch({
    method,
    url:`${proxy}/verifyToken`
  })
}
