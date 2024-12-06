const uploadsService = require('@services/uploadsService');
const {uploadsModel} = require('@models/v1');
const apiResponse = require('@utils/utils.apiResponse');
const {uploadMiddleware} = require("@middlewares/uploadMiddleware");
const {body, query, validationResult} = require('express-validator');
const tokenAuthentication = require('@middlewares/tokenAuthentication')
exports.getAll = [
    async (req, res, next) => {
        try {
            let query = req.body;

            // 调用服务层方法获取数据
            const data = await uploadsService.getAll(query);
            
            return apiResponse.successResponseWithData(res, "Success.", data);
        } catch (err) {
            next(err);
        }
    }
];
exports.create = [
    uploadMiddleware('uploads'),
    tokenAuthentication,
    async (req, res, next) => {
        try {
            if (!req.file) return apiResponse.ErrorResponse(res, '没有上传文件');
            // 获取图片信息
            const file = req.file;
            const filename = file.originalname;
            const user = req.user;
            console.log("*****************");
            console.log(filename)
            // 检查是否已存在
            const existing = await uploadsModel.findOne({
                where: {
                    filename: filename
                }
            });

            if (existing) {
                return apiResponse.validationErrorWithData(res, "已创建，请创建其他文件.");
            }


            const data = {
                filename: file.originalname,
                filepath: file.path,
                createBy: user.id,
                promptId: req.body.promptId,
                llm: req.body.llm
            }
            
            // 调用服务层方法获取数据
            const ret = await uploadsService.create(data);
            return apiResponse.successResponse(res,  "Success.");
        } catch (err) {
            
            next(err);
        }
    }
];