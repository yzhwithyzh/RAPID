const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 动态加载 controller 中的方法并生成对应的路由
const controllerPath = path.resolve(__dirname, '../../../controllers/v1/sys/checklistController.js');
const controller = require(controllerPath);

const methods = Object.keys(controller);

methods.forEach(method => {
  // 假设所有方法都是 POST 请求
  router.post(`/${method}`, controller[method]);
});

module.exports = router;