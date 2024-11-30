import api from '@/api'
import { basePermissions } from '@/settings'
import { lStorage } from '@/utils/index.js'

export async function getUserInfo() {
  const res = await api.getUser()
  const { id, username, profile, roles, current_role_id } = res.data || {}
  return {
    id,
    username,
    avatar: profile?.avatar,
    nick_name: profile?.nick_name,
    gender: profile?.gender,
    address: profile?.address,
    email: profile?.email,
    roles,
    currentRole: roles.find(item => item.id === current_role_id),
  }
}

export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}

// 获取字典列表，并存入缓存
export function getDictList() {
  api.getDictList().then((res) => {
    const values = {}
    Object.keys(res.data).forEach((key) => {
      values[key] = res.data[key]
    })
    lStorage.set('dict', values)
  })
}

// 或者字典value映射
export function getDictMap(key, value) {
  const dict = lStorage.get('dict')
  const current = dict[key]
  if (!current) {
    return null
  }
  const map = current.reduce((acc, item) => {
    acc[item.value] = item
    return acc
  }, {})
  return map[value]?.label || ''
}
// 获取下拉数据
export function getDictOptions(key) {
  const dict = lStorage.get('dict')
  if (!dict) {
    return []
  }
  return dict[key] || []
}
