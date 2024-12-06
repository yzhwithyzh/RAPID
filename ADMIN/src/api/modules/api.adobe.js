import service from '../server'

export const adobeList = (data) => {
    return service.post('/v1/sys/adobe/list', data)
}
export const adobeCreate = (data) => {
    return service.post('/v1/sys/adobe/create', data)
}
export const adobeUpdate = (data) => {
    return service.post('/v1/sys/adobe/update', data)
}
export const adobeDelete = (data) => {
    return service.post('/v1/sys/adobe/delete', data)
}
export const adobeFindOne = (data) => {
    return service.post('/v1/sys/adobe/findOne', data)
}


