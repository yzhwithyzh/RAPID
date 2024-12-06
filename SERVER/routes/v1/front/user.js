/**
 *@author YZH
 *@date 2024/05/30
 *@Description:用户相关的接口
 */

 const express = require('express');
 const router = express.Router();
 const UserController = require('@controllers/v1/front/userController')
 
 /****************************************************************************/
 
 /**
  * 登录
  * @route POST /v1/front/user/login
  * @group 权限验证 - 登录注册相关
  * @param {string} username 用户名
  * @param {string} password 密码
  * @param {string} code 密码
  * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
  * @returns {Error}  default - Unexpected error
  */
 
 router.post('/login', UserController.login);
 
 
 
 /**
  * 注册
  * @route POST /v1/front/user/register
  * @group 权限验证 - 登录注册相关
  * @param {string} username 用户名
  * @param {string} password 密码
  * @param {string} nickname 昵称
  * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
  * @returns {Error}  default - Unexpected error
  */
 router.post('/register', UserController.register);
 

 
 module.exports = router;
 