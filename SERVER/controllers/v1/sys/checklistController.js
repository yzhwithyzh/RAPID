// controllers/promptsController.js
const {checklistModel} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission} = require("@middlewares/authMiddleware");
const llmRemoteService = require('@services/llmRemoteService');
const {Op} = require('sequelize');
/**
 * 获取所有清单
 * @route POST /v1/sys/checklist/list
 * @group 清单管理 - 清单相关
 * @returns {object} 200 - 成功返回清单列表
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
            const totalCount = await checklistModel.count();
            // 查询数据库
            const prompts = await checklistModel.findAll({
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
exports.getAll =  [
    
    async (req, res, next) => {
        try {
            // 从请求中获取分页、排序和查询参数
            let query = req.body;
            let params = query.params || {};
            let sortColumn = query.sort?.columnKey || 'createdAt';
            let sortOrder = query.sort?.order === 'ascend' ? 'ASC' : 'DESC';

            // 构建查询条件
            let whereConditions = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    whereConditions[key] = {[Op.like]: `%${params[key]}%`};
                }
            }

          
            // 查询数据库
            const prompts = await checklistModel.findAll({
                where: {
                    ...whereConditions,
                    status: 1
                },
                attributes: ['id', 'name'], 
                order: [[sortColumn, sortOrder]],
            });
            return apiResponse.successResponseWithData(res, "Success.", {
                result: prompts,
            })
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 创建清单
 * @route POST /v1/sys/checklist/create
 * @group 清单管理 - 清单相关
 * @param {string} name.required - 清单名
 * @returns {object} 200 - 清单创建成功
 * @returns {Error}  default - 错误响应
 */
exports.create = [
    body("name").notEmpty().withMessage('清单名称不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            // 检查是否已存在
            const existing = await checklistModel.findOne({
                where: {
                    name: req.body.name
                }
            });

            if (existing) {
                return apiResponse.validationErrorWithData(res, "清单已创建，请创建其他清单.");
            }

            // 创建
            const newOne = await checklistModel.create({...req.body});
            return apiResponse.successResponse(res, "创建成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取单个checklist
 * @route POST /v1/sys/checklist/findOne
 * @group 请单管理 - 清单相关
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
            const one = await checklistModel.findByPk(id);
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
 * 更新清单
 * @route POST /v1/sys/checklist/update
 * @group 清单管理 - 清单相关
 * @param {number} id.required - 清单ID
 * @returns {object} 200 - 清单更新成功
 * @returns {Error}  default - 错误响应
 */
exports.update = [
    
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const id = req.body.id;

            const one = await checklistModel.findByPk(id);
            if (!one) {
                return apiResponse.notFoundResponse(res, "清单不存在.");
            }

            await one.update({...req.body});

            return apiResponse.successResponse(res, "清单更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除清单
 * @route POST /v1/sys/checklist/delete
 * @group 清单管理 - 清单相关
 * @param {number} id.required - 清单ID
 * @returns {object} 200 - 清单删除成功
 * @returns {Error}  default - 错误响应
 */
exports.delete = [
 
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            
           
            const id = req.body.id;

            const one = await checklistModel.findByPk(id);
            if (!one) {
                return apiResponse.notFoundResponse(res, "清单不存在.");
            }

            await one.destroy();

            
            return apiResponse.successResponse(res, "清单删除成功.");
        } catch (err) {
            next(err);
        }
    }
];

exports.generateSubquestion = [
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const question = req.body.question;
            const description = req.body.description;
            
            const ret = await llmRemoteService.generateSubquestion(question, description)
            if(ret.code != 200){
                return apiResponse.validationErrorWithData(res, ret);
            }

            return apiResponse.successResponseWithData(res, "Success.", ret.data);
        } catch (err) {
            next(err);
        }
    }
]
