import Base from 'common/base.js';
import fs from 'fs';
import path from 'path';
import request from 'request';
let mock = [];
function rP (arr) {
  var max = Math.max.apply(this, arr);
  var min = Math.min.apply(this, arr);
  return Math.round(Math.random() * (max - min) + min);
}

function add0 (n) {
  return n < 10 ? '0' + n : '' + n;
}
for (var i = 0; i < 24; i++) {
  mock.push({
    "time": add0(parseInt(i / 2)) + ':' + (i % 2 ? '30' : '00'),
    "fect": rP([22, 28]),
    "start": rP([17, 22]),
    "end": rP([28, 32])
  });
}
var category = [];
var dottedBase = +new Date();
var lineData = [];
var barData = [];
for (var i = 0; i < 20; i++) {
  var date = new Date(dottedBase += 1000 * 3600 * 24);
  category.push([
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join('-'));
  var b = Math.random() * 200;
  var d = Math.random() * 200;
  barData.push(b)
  lineData.push(d + b);
}
var sleeps = new Promise((resolve,reject)=>{
  setTimeout(() => {
    resolve()
  }, 2000);
})

let localhost=null;
function getClientIp (req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
}
function getPlaceByIp(ip){
  return new Promise((resolve,reject)=>{
    request({
      uri:`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`
    },(err,res)=>{
      if(err){
        reject(err);
      }
      resolve(res);
    })
  })
}
class Test extends Base {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    this.getScatterData = this.getScatterData.bind(this);
    this.getLineData = this.getLineData.bind(this);
    this.downLoad = this.downLoad.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.getIp = this.getIp.bind(this);
  }
  async getIp(req,res){
    const ip = getClientIp(req);

    // let {ip} = req.query;
    // console.log(ip);
    if(ip.length<7){
      res.send({
        message:'无法获取IP'
      });
      return false;
    }
    let {body} = await getPlaceByIp(ip.split(',')[0]);
    let {data} = JSON.parse(body);
    res.send(data);
  }
  async downLoad(req,res){
    await sleeps;
    var buff = fs.readFileSync(path.dirname(__filename) + '/abcd.xlsx');
    res.set('Content-Disposition', "excel.xlsx")
    res.end(buff)
    // fs.readFile(path.dirname(__filename) + '/a.json',(err,file)=>{
    //   if(err){
    //     console.log(err);
    //     return res.send('错误')
    //   }
    //   res.file(file);
    //   // res.send(file);
    // })
  }
  async getData (req, res, next) {
    let data = await this.sleep({
      content: '这里是测试内容'
    });
    res.send(data);
  }
  async getScatterData (req, res, next) {
    let data = await this.sleep(
      [
        [110, 625.76]
      ], 1000);
    res.send(data);
  }
  async getLineData (req, res, next) {
    let data = await this.sleep({
      category,
      dottedBase,
      lineData,
      barData
    });
    res.send(data);
  }
  async getTotal (req, res, next) {
    let data = await this.sleep({
      total:200
    },1000)
    res.send(data)
  }
}
export default new Test();
