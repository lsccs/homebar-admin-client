import { usePermissionStore, useRouterStore, useTabStore, useUserStore } from '@/store'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: Cookies.get('satoken'),
  }),
  actions: {
    resetToken() {
      this.accessToken = Cookies.get('satoken')
    },
    toLogin() {
      const { router, route } = useRouterStore()
      router.replace({
        path: '/login',
        query: route.query,
      })
    },
    async switchCurrentRole() {
      this.resetLoginState()
    },
    resetLoginState() {
      const { resetUser } = useUserStore()
      const { resetRouter } = useRouterStore()
      const { resetPermission, accessRoutes } = usePermissionStore()
      const { resetTabs } = useTabStore()
      // 重置路由
      resetRouter(accessRoutes)
      // 重置用户
      resetUser()
      // 重置权限
      resetPermission()
      // 重置Tabs
      resetTabs()
      this.resetToken()
    },
    async logout() {
      this.resetLoginState()
      this.toLogin()
    },
  },
  persist: {
    key: 'vue-naivue-admin_auth',
  },
})
