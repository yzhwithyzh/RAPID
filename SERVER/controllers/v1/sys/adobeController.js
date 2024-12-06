const adobeService = require('@services/adobeService');
const apiResponse = require('@utils/utils.apiResponse');

const {body, query, validationResult} = require('express-validator');
const tokenAuthentication = require('@middlewares/tokenAuthentication')
exports.getAll = [
    async (req, res, next) => {
        try {
            let query = req.body;

            // 调用服务层方法获取数据
            const data = await adobeService.getAll(query);
            
            return apiResponse.successResponseWithData(res, "Success.", data);
        } catch (err) {
            next(err);
        }
    }
];
exports.create = [   
    tokenAuthentication,
    async (req, res, next) => {
        try {
            const data = req.body;
            
            // 调用服务层
            const ret = await adobeService.create(data);
            return apiResponse.successResponse(res,  "Success.");
        } catch (err) {
            next(err);
        }
    }
];


exports.findOne = [
    
    body("id").notEmpty().withMessage('ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const id = req.body.id;
            // 在 attributes 中指定要返回的字段，排除不需要返回的字段
            const one = await adobeService.findOne(id);
            if (!one) {
                return apiResponse.notFoundResponse(res, "不存在.");
            }

            return apiResponse.successResponseWithData(res, "Success.", one);
        } catch (err) {
            next(err);
        }
    }
];


exports.update = [
    
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const id = req.body.id;

            await adobeService.update(id, req.body);
            return apiResponse.successResponse(res, "更新成功.");
        } catch (err) {
            next(err);
        }
    }
];


exports.delete = [
 
    body("id").notEmpty().withMessage('ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const id = req.body.id;

            await adobeService.deleteOne(id);
            return apiResponse.successResponse(res, "删除成功.");
        } catch (err) {
            next(err);
        }
    }
];
