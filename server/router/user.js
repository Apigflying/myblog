import express from 'express';
import userController from 'controller/user/user.js';
const router = express.Router();
// 注册
router.post('/signUp',userController.signUp);
// 通过用户名、密码登录
router.post('/loginByUserName',userController.loginByUserName);
// 获取用户信息
router.post(
  '/getUserInfo',
  userController.verifyToken,
  userController.findUserInfoByUserName, // 发现用户的信息
  userController.getUserInfo // 将信息发送到前端
);
// 更新用户信息
router.post(
  '/updateUserMessage',
  userController.verifyToken,
  userController.findUserInfoByUserName, // 发现用户的信息
  userController.updateUserMessage // 更新用户信息
)

export default router;
