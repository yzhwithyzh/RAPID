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

export const promptsFindOne = (data) => {
    return service.post('/v1/sys/prompts/findOne', data)
}


