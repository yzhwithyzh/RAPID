import service from '../server'

export const promptsList = (data) => {
    return service.post('/v1/sys/prompts/list', data)
}
export const promptsCreate = (data) => {
    return service.post('/v1/sys/prompts/create', data)
}
export const promptsUpdate = (data) => {
    return service.post('/v1/sys/prompts/update', data)
}
export const promptsDelete = (data) => {
    return service.post('/v1/sys/prompts/delete', data)
}
// 重置密码
export const promptsReset = (data) => {
    return service.post('/v1/sys/prompts/reset', data)
}
// 获取用户信息
export const promptsFindOne = (data) => {
    return service.post('/v1/sys/prompts/findOne', data)
}


