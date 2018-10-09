import express from "express";
import db from './mongoDB/db.js';
import path from 'path';
import router from 'router/index.js';
import configLite from 'config-lite';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';

const config = configLite(__dirname);
const app = express();

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
// 处理post请求的参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router(app);

app.use(history());
// 静态资源文件目录
app.use(express.static(path.join(__dirname, '..', '/dist')));

app.listen(config.port, () => {
  console.log('server listen at http://localhost:' + config.port);
});


