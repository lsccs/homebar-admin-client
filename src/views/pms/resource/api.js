import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/admin/permission/all_tree'),
  getMenuDetail: id => request.get(`/admin/menu/detail_base?id=${id}`),
  addPermission: data => request.post('/admin/menu/add', data),
  addBtnPermission: data => request.post('/admin/menu/button_add', data),
  deletePermission: ids => request.delete(`/admin/menu/delete`, { data: { ids } }),
  savePermission: data => request.put(`/admin/menu/update`, data),

  getButtons: data => request.post(`/admin/menu/button_list`, data),
}
