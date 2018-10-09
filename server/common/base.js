import formidable from 'formidable';
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import qiniu from 'qiniu'
import moment from 'moment';
import configLite from 'config-lite';
const {accessKey, secretKey,scope,urlArea,urlSpace} = configLite(__dirname);
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
export default class Base {
  sleep (data, timeout = 2000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(data);
      }, timeout);
    })
  }
  getReqData(req) {
    return  new Promise((resolve,reject)=>{
      const form = new formidable.IncomingForm();
      form.parse(req, (err, filds, files) => {
        if (err) {
          reject(err);
        }
        resolve(filds);
      })
    })
  }
  createQNToken(){
    var options = {
      scope:scope,
      expires: 7200 // 有效时间
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return {
      uploadToken,
      urlArea,
      urlSpace
    }
  }
  createTokenBase (payload) {
    return new Promise((resolve, reject) => {
      // path.dirname(__filename) 可以保证在引用文件时候，不受相对路径的影响，而使用绝对路径
      fs.readFile(path.dirname(__filename) + '/rsa_private_key.pem', function (err, data) {
        if (err) {
          reject(err)
        }
        // 过期时间
        let exp = moment().add(1,'d').valueOf();
        jwt.sign({
          payload,
          exp,
        }, data, {
            algorithm: 'RS256'
          }, function (err, token) {
            resolve(token);
          })
      })
    })
  }
  verifyTokenBase (token) {
    let cert = fs.readFileSync(path.dirname(__filename) + '/rsa_public_key.pem');//公钥
    let res;
    try {
      let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
      let { exp = 0 } = result, current = moment().valueOf();
      if (current <= exp) {
        // 没有过期 ，获取用户信息
        res = Object.assign({},result.payload,{
          code:200
        });
      } else { // token过期了
        res = {
          code:400,
          message:'登录过期，请重新登录'
        }
      }
    } catch (e) {
      res = {
        code:400,
        message:'验证失败，请重新登录！'
      };
    }
    return res;
  }
};
