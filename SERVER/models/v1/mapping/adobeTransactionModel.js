// models/uploadsModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const {aes} = require('@utils/utils.crypto')

// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('adobeTransaction', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
       
        adobe_id: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: 'adobe的id',
        },

        file_id: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: 'file的id',
        },    
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,  
            comment: '状态',
        },
        transaction: {
            type: DataTypes.INTEGER,
            notEmpty: false,
            notNull: false,
            allowNull: true,
            comment: '花费transaction次数',
        },
    },
    {
       
        freezeTableName: true, // 禁止表名自动复数化
    });



    module.exports 