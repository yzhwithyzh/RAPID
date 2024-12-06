
import service from '../server'
// 上传文件
export const uploadFile = (data) => {
    return service.post('/v1/common/upload', data)
}
// 删除图片
export const deleteImg = (filename) => {
    return service.get('/v1/common/files/delete/img/'+filename)
}
// 删除视频
export const deleteMedia = (filename) => {
    return service.get('/v1/common/files/delete/media/'+filename)
}
// 删除文件
export const deleteFile = (filename) => {
    return service.get('/v1/common/files/delete/files/'+filename)
}
export const getList  = (data) => {
    return service.post('/v1/front/uploads/list',data)
} 
export const create = (data) => {
    return service.post('/v1/front/uploads/create',data)
}
export const downloadExcel = (data) => {
    return service.post('/v1/front/uploads/downloadExcel',data,null,'blob')
}
export const getUploadById = (data) => {
    return service.post('/v1/front/uploads/getUploadById',data)
}
export const getSysList  = (data) => {
    return service.post('/v1/sys/uploads/list',data)
} 
export const listAll  = (data) => {
    return service.post('/v1/front/uploads/listAll',data)
} 
export const createOne = (data) => {
    return service.post('/v1/front/uploads/createOne',data)
}