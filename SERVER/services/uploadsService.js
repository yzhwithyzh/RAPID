const { Op } = require('sequelize');
const {uploadsModel,userModel,checklistModel} = require('@models/v1'); // 根据实际路径调整
uploadsModel.belongsTo(userModel, {
    foreignKey: {
        name: 'createBy',
        allowNull: true  // 设置是否允许外键为空
    },
    as: 'creator'
    
});

checklistModel.hasMany(uploadsModel, { as: 'uploads', foreignKey: 'promptId',constraints: false  });
uploadsModel.belongsTo(checklistModel, {
    as: 'promptInfo',
    foreignKey: 'promptId', // 上传记录表中关联的字段
    constraints: false // 不创建实际的外键约束
});
// promptsModel.hasMany(uploadsModel, { foreignKey: 'promptId', as: 'prompt_uploads' });
// 在 userModel 定义中
//userModel.hasMany(uploadsModel, { foreignKey: 'createBy', as: 'uploads' });

const getAll = async (query) => {
    let params = query.params || {};
    let current = Number(query.pagination?.current || 1) || 1;
    let pageSize = Number(query.pagination?.pageSize || 15) || 15;
    let sortColumn = query.sort?.columnKey || 'createdAt';
    let sortOrder = query.sort?.order === 'ascend' ? 'ASC' : 'DESC';

    // 构建查询条件
    let whereConditions = {};
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            whereConditions[key] = { [Op.like]: `%${params[key]}%` };
        }
    }

    // 查询数据库获取整张表的总记录数
    const totalCount = await uploadsModel.count({ where: whereConditions });

    // 查询数据库
    const datas = await uploadsModel.findAll({
        where: whereConditions,
        attributes: { exclude: ["parsed_content","html_content"] }, // 排除 parsed_content 字段
        include: [{
            model: userModel,
            as: 'creator',
            attributes: ['username'] // 选择用户的名字
        },
        {
            model: checklistModel,
            as: 'promptInfo',
            attributes: ['name'], 
            required: false
        }],
        order: [[sortColumn, sortOrder]],
        offset: (current - 1) * pageSize,
        limit: pageSize,
    });
    console.log(datas)
    return {
        result: datas,
        current,
        pageSize,
        total: totalCount
    };
};
const create = async (data) => {
    // 创建
    const newOne = await uploadsModel.create({ ...data });
    return newOne;
};

const findOne = async (id) => {
    const one = await uploadsModel.findByPk(id);
    if (!one) {
        throw new Error('不存在.');
    }
    return one;
};

const update = async (id, data) => {
    const one = await uploadsModel.findByPk(id);
    if (!one) {
        throw new Error('不存在.');
    }
    await one.update({ ...data });
    return one;
};

const deleteOne = async (id) => {
    const one = await uploadsModel.findByPk(id);
    if (!one) {
        throw new Error('不存在.');
    }
    await one.destroy();
    return one;
};

module.exports = {
    getAll,
    create,
    findOne,
    update,
    deleteOne
};
