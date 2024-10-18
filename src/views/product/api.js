
import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/product/add', data),
  read: (data = {}) => request.post('/m/web/product/list', data),
  detail: id => request.get(`/m/web/product/detail?id=${id}`),
  update: data => request.put(`/m/web/product/update`, data),
  delete: ids => request.delete(`/m/web/product/delete`, { data: { ids } }),
}
