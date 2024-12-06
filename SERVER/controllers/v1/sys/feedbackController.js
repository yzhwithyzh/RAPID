// controllers/promptsController.js
const {feedbackModel} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {Op} = require('sequelize');
/**
 * 获取所有列表
 * @route POST /v1/sys/feedback/list
 * @group 反馈管理 - 反馈相关
 * @returns {object} 200 - 成功返回反馈列表
 * @returns {Error}  default - 错误响应
 */
exports.list = [
    
    async (req, res, next) => {
        try {
            // 从请求中获取分页、排序和查询参数
            let query = req.body;
            let params = query.params || {};
            let current = Number(query.pagination?.current || 1) || 1;
            let pageSize = Number(query.pagination?.pageSize || 15) || 15;
            let sortColumn = query.sort?.columnKey || 'createdAt';
            let sortOrder = query.sort?.order === 'ascend' ? 'ASC' : 'DESC';

            // 构建查询条件
            let whereConditions = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    whereConditions[key] = {[Op.like]: `%${params[key]}%`};
                }
            }

            // 查询数据库获取整张表的总记录数
            const totalCount = await feedbackModel.count();
            // 查询数据库
            const allData = await feedbackModel.findAll({
                where: whereConditions,
                order: [[sortColumn, sortOrder]],
                offset: (current - 1) * pageSize,
                limit: pageSize,
            });
            return apiResponse.successResponseWithData(res, "Success.", {
                result: allData,
                current,
                pageSize,
                total: totalCount
            })
        } catch (err) {
            next(err);
        }
    }
];

exports.getListByUploadId = [
    async (req, res, next) => {
        try {
            let uploadId = req.body.uploadId;
            // 查询数据库
            const allData = await feedbackModel.findAll({
                where: {
                    uploadId: uploadId
                }    
            });
            return apiResponse.successResponseWithData(res, "Success.", allData)
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 创建反馈
 * @route POST /v1/sys/feedback/create
 * @group 反馈管理 - 反馈相关
 * @param {string} name.required - 反馈名
 * @returns {object} 200 - 反馈创建成功
 * @returns {Error}  default - 错误响应
 */
exports.create = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            
            // 创建
            const newOne = await feedbackModel.create({...req.body});
            
            return apiResponse.successResponse(res, newOne.id);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取单个feedback
 * @route POST /v1/sys/feedback/findOne
 * @group 请单管理 - 反馈相关
 * @param {number} id.required - ID
 * @returns {object} 200 - 成功返回单个
 * @returns {Error}  default - 错误响应
 */

exports.findOne = [
    
    body("id").notEmpty().withMessage('ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const id = req.body.id;
            console.log(id);
            // 在 attributes 中指定要返回的字段，排除不需要返回的字段
            const one = await feedbackModel.findByPk(id);
            if (!one) {
                return apiResponse.notFoundResponse(res, "不存在.");
            }

            return apiResponse.successResponseWithData(res, "Success.", one);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新反馈
 * @route POST /v1/sys/feedback/update
 * @group 反馈管理 - 反馈相关
 * @param {number} id.required - 反馈ID
 * @returns {object} 200 - 反馈更新成功
 * @returns {Error}  default - 错误响应
 */
exports.update = [
    
    body("id").notEmpty().withMessage('反馈ID不能为空.'),
    tokenAuthentication,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const id = req.body.id;

            const one = await feedbackModel.findByPk(id);
            if (!one) {
                return apiResponse.notFoundResponse(res, "反馈不存在.");
            }

            await one.update({...req.body});

            return apiResponse.successResponse(res, "反馈更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除反馈
 * @route POST /v1/sys/feedback/delete
 * @group 反馈管理 - 反馈相关
 * @param {number} id.required - 反馈ID
 * @returns {object} 200 - 反馈删除成功
 * @returns {Error}  default - 错误响应
 */
exports.delete = [
 
    body("id").notEmpty().withMessage('反馈ID不能为空.'),
    tokenAuthentication,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            
           
            const id = req.body.id;

            const one = await feedbackModel.findByPk(id);
            if (!one) {
                return apiResponse.notFoundResponse(res, "反馈不存在.");
            }

            await one.destroy();
           
            
            return apiResponse.successResponse(res, "反馈删除成功.");
        } catch (err) {
            next(err);
        }
    }
];

