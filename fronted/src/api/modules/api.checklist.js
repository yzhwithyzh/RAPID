import service from '../server'

export const checkList = (data) => {
    return service.post('/v1/sys/checklist/list', data)
}
export const checklistCreate = (data) => {
    return service.post('/v1/sys/checklist/create', data)
}
export const checklistUpdate = (data) => {
    return service.post('/v1/sys/checklist/update', data)
}
export const checklistDelete = (data) => {
    return service.post('/v1/sys/checklist/delete', data)
}

export const checklistFindOne = (data) => {
    return service.post('/v1/sys/checklist/findOne', data)
}

export const checkListGetall = (data) => {
    return service.post('/v1/sys/checklist/getAll', data)
}
export const getProgress = ()=>{
    return service.get("/com/getProgress")
}
