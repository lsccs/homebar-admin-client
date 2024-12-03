/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:50:38
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  // 获取用户信息
  getUser: () => request.get('/m/web/user/ex_detail'),
  // 刷新token
  refreshToken: () => request.get('/auth/refresh/token'),
  // 登出
  logout: () => request.post('/auth/logout', {}, { needTip: false }),
  // 切换当前角色
  switchCurrentRole: role => request.put(`/m/web/user/switch_role`, { role_id: role }),
  // 获取角色权限
  getRolePermissions: () => request.get('/m/web/permission/tree'),
  // 验证菜单路径
  validateMenuPath: path => request.get(`/m/web/permission/validate?path=${path}`),
  // 获取枚举字典
  getDictList: () => request.get(`/m/web/dict`),
}
