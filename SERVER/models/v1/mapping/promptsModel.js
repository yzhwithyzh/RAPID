// models/userModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const {aes} = require('@utils/utils.crypto')

// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('prompts', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
       
        name: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '清单名称',
        },
        systemPrompt: {
            type: DataTypes.STRING,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '系统提示词',
        },
        items:{
            type: DataTypes.JSON,
            notNull: true,
            notEmpty: true,
            comment: '相关信息',
            
        },
        
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,  // 1 正常 2 停用
            comment: '状态',
        },
       
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });
