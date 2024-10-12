
import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/raw_material/add', data),
  read: (data = {}) => request.post('/m/web/raw_material/list', data),
  detail: id => request.get(`/m/web/raw_material/detail?id=${id}`),
  update: data => request.put(`/m/web/raw_material/update`, data),
  updateEnable: data => request.put(`/m/web/raw_material/line_update`, data),
  delete: ids => request.delete(`/m/web/raw_material/delete`, { data: { ids } }),
}
