// models/uploadsModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const {aes} = require('@utils/utils.crypto')

// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('uploads', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
       
        filename: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '文件名',
        },

        filepath: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '文件路径',
        },    
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,  // 1 待解析 2 已完成
            comment: '状态',
        },
        parsed_content: {
            type: DataTypes.TEXT('long'),
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '解析后的内容',
        },
        html_content:{
            type: DataTypes.TEXT('long'),
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: 'pdf的html内容',
        },
        token:{
            type: DataTypes.INTEGER,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '花费token数量',
        },
        createBy:{
            type: DataTypes.UUID,
         
            allowNull: true,
            comment: '创建人',
        },
        remark: {
            type: DataTypes.TEXT,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '备注',
        },
        promptId:{
            type: DataTypes.UUID,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '清单id',
        },
        llm:{
            type: DataTypes.CHAR,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: 'llm模型',
        },
    },
    {
        paranoid: true, // 启用软删除
        freezeTableName: true, // 禁止表名自动复数化
    });



    module.exports 