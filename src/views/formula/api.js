
import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/formula/add', data),
  read: (data = {}) => request.post('/m/web/formula/ex_list', data),
  detail: id => request.get(`/m/web/formula/ex_detail?id=${id}`),
  update: data => request.put(`/m/web/formula/update`, data),
  updateEnable: data => request.put(`/m/web/formula/line_update`, data),
  delete: ids => request.delete(`/m/web/formula/delete`, { data: { ids } }),
}
