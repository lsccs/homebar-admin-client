import { request } from '@/utils'

export default {
  create: data => request.post('/admin/user/add', data),
  read: (data = {}) => request.post('/admin/user/base_list', data),
  update: data => request.put(`/admin/user/update`, data),
  updateEnable: data => request.put(`/admin/user/line_update`, data),
  delete: ids => request.delete(`/admin/user/delete`, { data: { ids } }),
  relation_role: data => request.post(`/admin/user/relation_role`, data),
  resetPwd: data => request.post(`/admin/user/reset_pwd`, data),
  getAllRoles: () => request.post('/admin/role/list', { filters: { enable: 1 } }),

  getUserList: (data = {}) => request.post('/admin/user/joint_list', data),
}
