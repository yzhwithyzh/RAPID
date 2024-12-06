/*@author YZH
*@date 2024/06/04
*@Description:文件解析的接口
*/

const express = require('express');
const router = express.Router();
const uploadsController = require('@controllers/v1/sys/uploadsController')

/****************************************************************************/

// 获取所有数据
router.post('/list', uploadsController.getAll);
// 创建用户
router.post('/create', uploadsController.create);
// // 获取指定用户
// router.post('/findOne', uploadsController.findOne);
// // 更新用户
// router.post('/update', uploadsController.update);
// // 删除用户
// router.post('/delete', uploadsController.delete);


module.exports = router;