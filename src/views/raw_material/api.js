/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:51
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: data => request.post('/m/web/raw_material/add', data),
  read: (data = {}) => request.post('/m/web/raw_material/list', data),
  detail: id => request.get(`/m/web/raw_material/detail_base?id=${id}`),
  update: data => request.put(`/m/web/raw_material/update`, data),
  updateEnable: data => request.put(`/m/web/raw_material/line_update`, data),
  delete: ids => request.delete(`/m/web/raw_material/delete`, { data: { ids } }),
}
