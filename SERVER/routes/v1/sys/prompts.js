// routes/promptsRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const promptsController = require('../../../controllers/v1/sys/promptsController');

const router = express.Router();

// 获取所有用户
router.post('/list', promptsController.getAllPrompts);
// 创建用户
router.post('/create', promptsController.createPrompt);
// 获取指定用户
router.post('/findOne', promptsController.findOnePrompt);
// 更新用户
router.post('/update', promptsController.updatePrompt);
// 删除用户
router.post('/delete', promptsController.deletePrompt);


module.exports = router;
