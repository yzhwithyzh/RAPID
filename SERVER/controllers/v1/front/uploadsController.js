const uploadsService = require('@services/uploadsService');
const apiResponse = require('@utils/utils.apiResponse');
const {uploadMiddleware} = require("@middlewares/uploadMiddleware");
const {body, query, validationResult} = require('express-validator');
const tokenAuthentication = require('@middlewares/tokenAuthentication');
const docx = require('docx');
const MyDocument = docx.Document;
const Packer = docx.Packer;
const Paragraph = docx.Paragraph;
const TextRun = docx.TextRun;
const TableRow = docx.TableRow;
const TableCell = docx.TableCell;
const Table = docx.Table;
exports.getAll = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            let query = req.body;
            const user = req.user;
            if(!query.params){
                query.params = {}
            }
            
            query.params.createBy = user.id;
            // 调用服务层方法获取数据
            const data = await uploadsService.getAll(query);
            
            return apiResponse.successResponseWithData(res, "Success.", data);
        } catch (err) {
            next(err);
        }
    }
];

exports.getListAll = [
    async(req, res, next) => {
        try {
            let query = req.body;
           
            if(!query.params){
                query.params = {}
            }
            
            // 调用服务层方法获取数据
            const data = await uploadsService.getAll(query);
            
            return apiResponse.successResponseWithData(res, "Success.", data);
        } catch (err) {
            next(err);
        }
    }
];

exports.getUploadById = [
    async (req, res, next) => {
        try {
            let query = req.body;

            // 调用服务层方法获取数据
            const data = await uploadsService.findOne(query.id);
            
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
            if (!req.file) return apiResponse.ErrorResponse(res, 'No file');
            // 获取图片信息
            const file = req.file;
            const filename = file.filename;
            const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const user = req.user;
           
            const data = {
                filename: originalname,
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

exports.createOne = [
    uploadMiddleware('uploads'),
   
    async (req, res, next) => {
        try {
            if (!req.file) return apiResponse.ErrorResponse(res, 'No file');
            // 获取图片信息
            const file = req.file;
            const filename = file.filename;
            const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            
           
            const data = {
                filename: originalname,
                filepath: file.path,
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

exports.findOnePrompt = [
    body("id").notEmpty().withMessage('ID not empty.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const prompt = await promptService.findOnePrompt(req.body.id);
            return apiResponse.successResponseWithData(res, "Success.", prompt);
        } catch (err) {
            if (err.message === '不存在.') {
                return apiResponse.notFoundResponse(res, err.message);
            }
            next(err);
        }
    }
];

exports.updatePrompt = [
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            await promptService.updatePrompt(req.body.id, req.body);
            return apiResponse.successResponse(res, "清单更新成功.");
        } catch (err) {
            if (err.message === '清单不存在.') {
                return apiResponse.notFoundResponse(res, err.message);
            }
            next(err);
        }
    }
];

exports.deletePrompt = [
    body("id").notEmpty().withMessage('清单ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            await promptService.deletePrompt(req.body.id);
            return apiResponse.successResponse(res, "清单删除成功.");
        } catch (err) {
            if (err.message === '清单不存在.') {
                return apiResponse.notFoundResponse(res, err.message);
            }
            next(err);
        }
    }
];

exports.downloadExcel = [
    body("id").notEmpty().withMessage('ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const one = await uploadsService.findOne(req.body.id);
            const Rows = [new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph('Item')],
                    }),
                    new TableCell({
                        children: [new Paragraph('Response')],
                    }),
                    new TableCell({
                      children: [new Paragraph('Answer')],
                  }),
                ],
            })];
            if(one.status!="2"){
                return apiResponse.ErrorResponse(res, "不能下载文档");
            }
            for (const item of JSON.parse(one.parsed_content)) {

                if (item.assistant === null || item.assistant === undefined || item.assistant.trim().length === 0) {
                  continue;
                }
                
                
                // 按换行符分割文本
                const textLines = item.assistant.split('\n');
  
                // 为每一行创建一个Paragraph对象
                const paragraphs = textLines.map(line => new Paragraph(line));    
  
                const regex = /Answer\s*(?:\d+)?:\s*(\S)/g;
  
                // 使用matchAll方法搜索所有匹配项
                const matches = [...item.assistant.matchAll(regex)];
  
                // 从matches中提取所有捕获的字符
                const followingChars = matches.map(match => match[1]);
                const answerParagraphs = followingChars.map(line => new Paragraph(line));
  
                Rows.push(
                    new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph(item.title)],
                        }),
                        new TableCell({
                            children: paragraphs,
                        }),
                        new TableCell({
                          children: answerParagraphs,
                      }),
                    ],
                }))
              };
        
        
            // 创建一个新文档
            const doc = new MyDocument({
                sections: [{
                    properties: {},
                    children: [
                        // 添加一个表格
                        new Table({
                            rows: Rows
                        }),
                    ],
                }],
            });
            // Packer.toBuffer(doc).then((buffer) => {
            //     let filename = one.filename;
            //     filename = filename.replace(/\.[^/.]+$/, "") + ".docx";
            //     filename = `ret_${encodeURIComponent(filename)}`;
            //     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            //     //res.setHeader('x-filename', encodeURIComponent(filename));
            //     res.send(buffer);
            // }).catch(err => {
            //     next(err);
            // });
            // 将文档打包成Blob
            Packer.toBuffer(doc).then((buffer) => {
                let filename = one.filename;
                // Remove any existing extension and add '.docx'
                filename = filename.replace(/\.[^/.]+$/, "") + ".docx";
                filename = `ret_${encodeURIComponent(filename)}`;
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('x-filename', encodeURIComponent(filename));
                res.send(buffer);
            });
           
        } catch (err) {
           
            return apiResponse.notFoundResponse(res, err.message);
           
           
        }
    }
];