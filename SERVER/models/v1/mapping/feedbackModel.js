// models/userModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const {aes} = require('@utils/utils.crypto')

// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('feedback', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
       
        reported: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '是否报道：Yes/No',
        },
        content: {
            type: DataTypes.STRING,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '反馈内容',
        },
        uploadId:{
            type: DataTypes.STRING,
            notNull: true,
            notEmpty: true,
            comment: '文章id',
        },
        questionId:{
            type: DataTypes.INTEGER,
            notNull: true,
            notEmpty: true,
            comment: '问题id',
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,  // 1 未处理 2 已处理
            comment: '状态： 1未处理/2已处理',
        },
       
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });
