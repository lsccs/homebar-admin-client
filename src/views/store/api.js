/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/store/add', data),
  read: (data = {}) => request.post('/m/web/store/list', data),
  detail: id => request.get(`/m/web/store/detail?id=${id}`),
  update: data => request.put(`/m/web/store/update`, data),
  updateEnable: data => request.put(`/m/web/store/line_update`, data),
  delete: ids => request.delete(`/m/web/store/delete`, { data: { ids } }),
}
