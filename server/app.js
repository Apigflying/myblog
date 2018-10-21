import express from "express";
import db from './mongoDB/db.js';
import path from 'path';
import router from 'router/index.js';
import configLite from 'config-lite';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';
import compression from 'compression';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';

const config = configLite(__dirname);
const app = express();
const RedisStore = connectRedis(session);
const redisClient = redis.createClient(config.redisPort, config.redisHost, { auth_pass: null });
//允许跨域请求
if (config.alloworigin) {
  app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method == 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
  });
}
// 开启gzip加速
app.use(compression({ threshold: 9 }))
// 处理post请求的参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboardCat',// 必须项。该值用于session ID的cookie签名。
  name: 'session-name',// session ID的Cookie名，该值会设置到response中，并可在request中读取。默认值为'connect.sid'
  cookie: {
    maxAge: 10*60*1000,// number（毫秒），用于指定Set-Cookie的Expires属性。设置后，Cookie将在指定时间后失效。
  },
  resave: false,// 强制将 session 保存回session存储区，即使在请求期间session从不被修改。该值默认为true
  saveUninitialized: true,// 强制将未初始的session保存到存储中。Session在新创建而未修改时，是未初始化状态
  store: new RedisStore({ client: redisClient }),
}));

router(app);

app.use(history());
// 静态资源文件目录
app.use(express.static(path.join(__dirname, '..', '/dist')));

app.listen(config.port, () => {
  console.log('server listen at http://localhost:' + config.port);
});


