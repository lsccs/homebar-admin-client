/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:28:30
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  toggleRole: data => request.post('/auth/role/toggle', data),
  getCapthcha: () => request.get('/system/capthcha'),
  login: data => request.post('/system/login', data, { needToken: false }),
  getUser: () => request.get('/user/detail'),
}
