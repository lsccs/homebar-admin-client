
import { request } from '@/utils'

const api = {
  // 分组列表
  fetchGroupList: () => request.post('/m/web/file_group/list_all'),
  fetchGroupAdd: (data) => request.post('/m/web/file_group/add', data),
  fetchGroupDelete: (ids) => request.delete('/m/web/file_group/delete', { data: {ids} }),

  fetchList: (data) => request.post('/m/web/file/list', data),

  fileUpdate: (data) => request.put('/m/web/file/update', data),
  fileDetail: (id) => request.get(`/m/web/file/detail?id=${id}`),
  upload: (data) => request.post('/m/web/file/upload', data),
  deleteFiles: (data) => request.delete('/m/web/file/delete', { data }),
  remove: () => request.get('/m/web/file/delete'),
}

export const upload = api.upload;

export default api;
