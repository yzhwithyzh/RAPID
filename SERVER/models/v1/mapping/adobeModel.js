// models/uploadsModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const {aes} = require('@utils/utils.crypto')

// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('adobe', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
       
        client_id: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: 'adobe的id',
        },

        client_secret: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: 'adobe密码',
        },    
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,  
            comment: '状态',
        },
        num: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '剩余次数',
        },
    },
    {
        paranoid: true, // 启用软删除
        freezeTableName: true, // 禁止表名自动复数化
    });



    module.exports 