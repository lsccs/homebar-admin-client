
import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/activity/add', data),
  read: (data = {}) => request.post('/m/web/activity/list', data),
  detail: id => request.get(`/m/web/activity/detail?id=${id}`),
  update: data => request.put(`/m/web/activity/update`, data),
  updateEnable: data => request.put(`/m/web/activity/line_update`, data),
  delete: ids => request.delete(`/m/web/activity/delete`, { data: { ids } }),
}
