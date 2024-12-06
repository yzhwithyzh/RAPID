const { Op } = require('sequelize');
const {adobeModel,adobeTransactionModel} = require('@models/v1'); // 根据实际路径调整

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
    const totalCount = await adobeModel.count({ where: whereConditions });

    // 查询数据库
    const datas = await adobeModel.findAll({
        where: whereConditions,
        order: [[sortColumn, sortOrder]],
        offset: (current - 1) * pageSize,
        limit: pageSize,
    });

    return {
        result: datas,
        current,
        pageSize,
        total: totalCount
    };
};
const create = async (data) => {
    // 创建
    const newOne = await adobeModel.create({ ...data });
    return newOne;
};

const createTransaction = async(data) => {

    const newOne = await adobeTransactionModel.create({...data});
    return newOne;

}


const findOne = async (id) => {
    const one = await adobeModel.findByPk(id);
    if (!one) {
        throw new Error('不存在.');
    }
    return one;
};

const update = async (id, data) => {
    const one = await adobeModel.findByPk(id);
    if (!one) {
        throw new Error('不存在.');
    }
    await one.update({ ...data });
    return one;
};

const deleteOne = async (id) => {
    const one = await adobeModel.findByPk(id);
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
    deleteOne,
    createTransaction
};
