import crypto from 'crypto'
import moment from 'moment';
import Base from 'common/base.js';
import UserModel from 'models/user/user.js';

class User extends Base {
  constructor() {
    super();
    this.loginByUserName = this.loginByUserName.bind(this);
    this.getToken = this.getToken.bind(this);
    this.signUp = this.signUp.bind(this);
    this.verifyToken = this.verifyToken.bind(this);
    this._encryption = this._encryption.bind(this);
    this.updateUserMessage = this.updateUserMessage.bind(this);
  }
  async findUserInfoByUserId (list) {
    /*
      list内的对象必须含有userId
      此函数会将userName、userPic添加进去
    */
    let data = null;
    if(!!list&&list.length){
      data = await Promise.all(list.map(async (item)=>{
        let user = await this.findUserInfoById(item.userId);
        return Object.assign({},item,{
          userName:user.username,
          userPic:user.picture,
        });
      }));
    }else{
      data = [];
    }
    return data;
  }
  async findUserInfoById(id){
    return await UserModel.findById(id);
  }
  async updateUserMessage(req,res){
    let {user,body} = req;
    try{
      let data = await UserModel.findByIdAndUpdate(user.id,Object.assign({},user,body));
      res.send({
        code:200,
        message:'更新数据成功！'
      })
    }catch(e){
      res.send({
        code:500,
        message:'user/updateUserMessage 报错'
      })
    }
  }
  // 通过用户名获取用户信息
  async findUserInfoByUserName(req,res,next){
    let {user} = req;
    if(user.username){
      let data = await UserModel.findOne({
        "username":user.username
      });
      req.user = {
        id:data._id,
        username: data.username,// 用户名
        picture:  data.picture, // 头像图片
        individualitySignature: data.individualitySignature,// 个性签名
        introduce: data.introduce, // 自我介绍
        createtime: data.createtime,// 用户创建时间
        authlist: data.authlist, // 权限列表
        articles: data.articles, // 保存文章编号
      };
      next();
    }else{
      res.send({
        code:404,
        message:'该用户不存在！'
      })
    }
  }
  // 通过token获取用户信息(username ,password,code)
  verifyToken (req, res, next) {
    // 从req中读取token
    const token = req.headers.authorization;
    if (token) {
      // 验证token的正确性
      let rootData = this.verifyTokenBase(token);
      // token过失效时间或者token没有验证通过，返回401
      if (rootData.code === 400) {
        res.send(rootData);
        return;
      } else if (rootData.code === 200) { // token验证通过，返回200
        let { username } = rootData;// 拿到username
        // 通过username获取用户权限列表
        req.user = {
          username
        }
        next();
      }
    } else {
      res.send({
        code:400,
        message: '登录信息有误，请重新登录后再试！'
      })
    }
  }
  // 获取用户信息
  getUserInfo (req,res){
    // 在下面的流程中，已经将user更改
    let {user} = req;
    res.send({
      code:200,
      message:'success',
      data:user
    })
  }
  // 上面的verifyToken获取用户的信息比较少，经过这个中间件，能够获取更多的user信息，req.user
  async findUserInfoByUserName(req,res,next){
    let {user} = req;
    if(user.username){
      let data = await UserModel.findOne({
        username:user.username
      });
      // 对user重新赋值，通过在token中获取的用户名，读取更多用户信息，重新赋值给req.user
      req.user = {
        id:data._id,
        username: data.username,// 用户名
        picture:  data.picture, // 头像图片
        individualitySignature: data.individualitySignature,// 个性签名
        introduce: data.introduce, // 自我介绍
        createtime: data.createtime,// 用户创建时间
        authlist: data.authlist, // 权限列表
        articles: data.articles, // 保存文章编号
      };
      next();
    }else{
      res.send({
        code:404,
        message:'该用户不存在！'
      })
    }
  }
  // 登录接口
  async loginByUserName (req, res) {
    const { username, password } = req.body;
    // 判断username是否存在，判断password是否存在，username用trim等
    if (!username.trim() || !password.trim()) {
      res.send({
        code: 401,
        message: '您输入的用户名密码有误，请重新输入！'
      })
      return;
    }
    try {
      // 通过用户名读取用户信息
      const userMes = await UserModel.findOne({ username });
      if (!userMes) {
        return res.send({
          state: -1,
          code: 200,
          message: '用户不存在'
        });
      }
      // 验证密码
      if (userMes.password !== this._encryption(password)) {
        return res.send({
          state: 0,
          code: 200,
          message: '密码错误'
        })
      }
      // 密码正确返回token给前端，token有过期时间
      const token = await this.getToken({
        username: userMes.username,
        password: userMes.password
      });
      return res.send({
        state: 1,
        code: 200,
        message: "登录成功",
        token
      });
    } catch (err) {
      res.send({
        state: 0,
        message: '发生错误了'
      })
    }
  }
  // 生成用户token
  async getToken (payload, options) { // 通过用户名密码 换取 token
    let token = await this.createTokenBase(payload, options);
    return token
  }
  // 判断 用户名 是否存在 存在返回true，不存在返回fasle
  async isUserNameExisting (username) {
    let data = await UserModel.find({
      username
    });
    return !!data.length;
  }
  // 注册接口
  async signUp (req, res) {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
      /*
        验证密码是否可用
      */
      res.send({
        code: 401,
        message: '缺少必填项'
      })
      return ;
    }
    try {
      // 如果用户名存在，不能注册
      let isUserExit = await this.isUserNameExisting(username);
      if (isUserExit) {
        res.send({
          code: 405,
          state: 2, // 用户名重复
          message: '用户名重复'
        })
        return;
      }
      // 将密码二次加密，保存到数据库
      const newpassword = this._encryption(password);
      const createTime = moment().valueOf();
      const user = {
        username,// 用户名
        password: newpassword, // 密码
        picture: 'http://osjykr1v3.bkt.clouddn.com/FsvJiwQsw4ZjPkeSAs7KhMdDVGHk', // 头像图片
        individualitySignature: '',// 个性签名
        introduce: '', // 自我介绍
        createtime: createTime,// 用户创建时间
        authlist: [], // 权限列表
        articles: [] // 保存文章编号
      }

      let data = await UserModel.create(user);
      return res.send({
        code: 200,
        state:1,
        message: "注册成功"
      })
    } catch (e) {
      res.send({
        code:500,
        error:e,
        message: '发生错误了',
      })
    }
  }
  // 加密
  _encryption (password) {
    const newpassword = this._Md5(this._Md5(password).sub(2, 7) + this._Md5(password));
    return newpassword;
  }
  _Md5 (password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
  }
}
export default new User();
