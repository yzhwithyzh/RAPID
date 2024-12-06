// controllers/promptsController.js
const {promptsModel} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const {Op} = require('sequelize');
/**
 * 获取所有清单
 * @route POST /v1/sys/prompts/list
 * @group 清单管理 - 清单相关
 * @returns {object} 200 - 成功返回清单列表
 * @returns {Error}  default - 错误响应
 */
exports.getAllPrompts = [
    
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
            const totalCount = await promptsModel.count();
            // 查询数据库
            const prompts = await promptsModel.findAll({
                where: whereConditions,
                order: [[sortColumn, sortOrder]],
                offset: (current - 1) * pageSize,
                limit: pageSize,
            });
            return apiResponse.successResponseWithData(res, "Success.", {
                result: prompts,
                current,
                pageSize,
                total: totalCount
            })
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 创建清单
 * @route POST /v1/sys/prompts/create
 * @group 清单管理 - 清单相关
 * @param {string} name.required - 清单名
 * @returns {object} 200 - 清单创建成功
 * @returns {Error}  default - 错误响应
 */
exports.createPrompt = [
    body("name").notEmpty().withMessage('清单名称不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            // 检查是否已存在
            const existingPrompts = await promptsModel.findOne({
                where: {
                    name: req.body.name
                }
            });

            if (existingPrompts) {
                return apiResponse.validationErrorWithData(res, "清单已创建，请创建其他清单.");
            }

            // 创建
            const newPrompt = await promptsModel.create({...req.body});
            return apiResponse.successResponse(res, "创建成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取单个prompt
 * @route POST /v1/sys/prompt/findOne
 * @group 请单管理 - 清单相关
 * @param {number} id.required - ID
 * @returns {object} 200 - 成功返回单个
 * @returns {Error}  default - 错误响应
 */

exports.findOnePrompt = [
    
    body("id").notEmpty().withMessage('ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const promptId = req.body.id;
            // 在 attributes 中指定要返回的字段，排除不需要返回的字段
            const prompt = await promptsModel.findByPk(promptId);
            if (!prompt) {
                return apiResponse.notFoundResponse(res, "不存在.");
            }

            return apiResponse.successResponseWithData(res, "Success.", prompt);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新清单
 * @route POST /v1/sys/prompt/update
 * @group 清单管理 - 清单相关
 * @param {number} id.required - 清单ID
 * @returns {object} 200 - 清单更新成功
 * @returns {Error}  default - 错误响应
 */
exports.updatePrompt = [
    
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const promptId = req.body.id;

            const prompt = await promptsModel.findByPk(promptId);
            if (!prompt) {
                return apiResponse.notFoundResponse(res, "清单不存在.");
            }

            await prompt.update({...req.body});

            return apiResponse.successResponse(res, "清单更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除清单
 * @route POST /v1/sys/prompt/delete
 * @group 清单管理 - 清单相关
 * @param {number} id.required - 清单ID
 * @returns {object} 200 - 清单删除成功
 * @returns {Error}  default - 错误响应
 */
exports.deletePrompt = [
 
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const promptId = req.body.id;

            const prompt = await promptsModel.findByPk(promptId);
            if (!prompt) {
                return apiResponse.notFoundResponse(res, "清单不存在.");
            }

            await prompt.destroy();

            return apiResponse.successResponse(res, "清单删除成功.");
        } catch (err) {
            next(err);
        }
    }
];

