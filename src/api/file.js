
import { request } from '@/utils'

const api = {
  // 分组列表
  fetchGroupList: () => request.post('/system/file_group/list_all'),
  fetchGroupAdd: (data) => request.post('/system/file_group/add', data),
  fetchGroupDelete: (ids) => request.delete('/system/file_group/delete', { data: {ids} }),

  fetchList: (data) => request.post('/system/file/list', data),

  fileUpdate: (data) => request.put('/system/file/update', data),
  fileDetail: (id) => request.get(`/system/file/detail?id=${id}`),
  upload: (data) => request.post('/system/file/upload', data),
  deleteFiles: (data) => request.delete('/system/file/delete', { data }),
  remove: () => request.get('/system/file/delete'),
}

export const upload = api.upload;

export default api;
