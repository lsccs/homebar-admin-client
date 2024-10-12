
import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/product_type/add', data),
  read: (data = {}) => request.post('/m/web/product_type/list', data),
  detail: id => request.get(`/m/web/product_type/detail?id=${id}`),
  update: data => request.put(`/m/web/product_type/update`, data),
  delete: ids => request.delete(`/m/web/product_type/delete`, { data: { ids } }),
}
