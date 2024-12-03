import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/m/web/permission/all_tree'),
  getMenuDetail: id => request.get(`/m/web/menu/detail?id=${id}`),
  addPermission: data => request.post('/m/web/menu/add', data),
  addBtnPermission: data => request.post('/m/web/menu/button_add', data),
  lineEditBtnPermission: data => request.put('/m/web/menu/line_update', data),
  editBtnPermission: data => request.post('/m/web/menu/button_edit', data),
  deletePermission: ids => request.delete(`/m/web/menu/delete`, { data: { ids } }),
  savePermission: data => request.put(`/m/web/menu/update`, data),

  getButtons: data => request.post(`/m/web/menu/button_list`, data),
}
