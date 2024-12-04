import {WEB_VIEW} from "@/router/web-view.js";
import {layoutSettingVisible} from "@/settings.js";

export function createPageLoadingGuard(router) {
  router.beforeEach((to) => {
    const isWebView = WEB_VIEW.includes(to.path)
    layoutSettingVisible.value = !isWebView;
    if (!isWebView) {
      $loadingBar.start()
    }
  })

  router.afterEach((to) => {
    setTimeout(() => {
      if (!WEB_VIEW.includes(to.path)) {
        $loadingBar.finish()
      }
    }, 200)
  })

  router.onError((to) => {
    if (!WEB_VIEW.includes(to.path)) {
      $loadingBar.error()
    }
  })
}
