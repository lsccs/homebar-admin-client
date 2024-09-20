/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  read: (params = {}) => request.post('/admin/role/list', params),
  update: data => request.post(`/admin/role/add_update`, data),
  delete: ids => request.delete(`/admin/role/delete`, { data: { ids } }),
  detail: id => request.get(`/admin/role/permission?id=${id}`),

  getAllPermissionTree: () => request.get('/admin/permission/all_tree'),

}
