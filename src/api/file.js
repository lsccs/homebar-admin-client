
import { request } from '@/utils'

const api = {
  // 获取文件列表
  fetchList: () => request.get('/system/file/list'),
  create: () => request.get('/system/file/add'),
  fileUpdate: () => request.get('/system/file/update'),

  upload: () => request.get('/system/file/upload'),
  getFileList: () => request.get('/system/file/list'),
  deleteFiles: () => request.get('/system/file/delete'),
  remove: () => request.get('/system/file/delete'),
}

export const fetchList = api.fetchList;
export const create = api.create;
export const upload = api.upload;
export const getFileList = api.getFileList;
export const deleteFiles = api.deleteFiles;
export const remove = api.remove;
export const fileUpdate = api.fileUpdate;
