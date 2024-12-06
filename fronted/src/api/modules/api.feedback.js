import service from '../server'

export const feedbackList = (data) => {
    return service.post('/v1/sys/feedback/list', data)
}
export const feedbackCreate = (data) => {
    return service.post('/v1/sys/feedback/create', data)
}
export const feedbackUpdate = (data) => {
    return service.post('/v1/sys/feedback/update', data)
}
export const feedbackDelete = (data) => {
    return service.post('/v1/sys/feedback/delete', data)
}

export const feedbackFindOne = (data) => {
    return service.post('/v1/sys/feedback/findOne', data)
}

export const getFeedbackListByUploadId = (data) => {
    return service.post('/v1/sys/feedback/getListByUploadId', data)
}
