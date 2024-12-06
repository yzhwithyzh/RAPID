/**
 *@author YZH
 *@date 2024/06/03
 *@Description:文件解析的接口
 */

 const express = require('express');
 const router = express.Router();
 const uploadsController = require('@controllers/v1/front/uploadsController')
 
 /****************************************************************************/
 
 // 获取所有数据
router.post('/list', uploadsController.getAll);
//获取部根据用户id获取上传数据
router.post('/listAll', uploadsController.getListAll)
// 创建用户
router.post('/create', uploadsController.create);
//创建解析文件
router.post('/createOne', uploadsController.createOne);
// // 获取指定用户
// router.post('/findOne', uploadsController.findOne);
// // 更新用户
// router.post('/update', uploadsController.update);
// // 删除用户
// router.post('/delete', uploadsController.delete);
router.post('/downloadExcel', uploadsController.downloadExcel);

router.post('/getUploadById', uploadsController.getUploadById)

module.exports = router;

 

 