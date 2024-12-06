import service from '../server'

export const getList = (data) => {
    return service.post('/v1/sys/checklist/list', data)
}
export const createOne = (data) => {
    return service.post('/v1/sys/checklist/create', data)
}
export const updateOne = (data) => {
    return service.post('/v1/sys/checklist/update', data)
}
export const deleteOne = (data) => {
    return service.post('/v1/sys/checklist/delete', data)
}

export const findOne = (data) => {
    return service.post('/v1/sys/checklist/findOne', data)
}

export const generateSubquestion = (data) => {
    return service.post('/v1/sys/checklist/generateSubquestion', data)
}
