/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  read: (params = {}) => request.post('/m/web/role/list', params),
  update: data => request.post(`/m/web/role/add_update`, data),
  lineUpdate: data => request.put(`/m/web/role/line_update`, data),
  delete: ids => request.delete(`/m/web/role/delete`, { data: { ids } }),
  detail: id => request.get(`/m/web/role/permission?id=${id}`),

  getAllPermissionTree: () => request.get('/m/web/permission/all_tree'),

}
