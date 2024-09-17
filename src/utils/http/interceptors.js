/**********************************
 * @FilePath: interceptors.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:40
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { resolveResError } from './helpers'

export function setupInterceptors(axiosInstance) {
  function resResolve(response) {
    const { data, status, config, statusText } = response

    const needTip = config?.needTip !== false

    // 根据code处理对应的操作，并返回处理后的message
    if (data.code !== 200 || status !== 200) {
      resolveResError(data.code || status, data?.message ?? statusText, needTip)
      return Promise.reject(null)
    }

    return Promise.resolve(data ?? response)
  }

  axiosInstance.interceptors.request.use(reqResolve, reqReject)
  axiosInstance.interceptors.response.use(resResolve, resReject)
}

function reqResolve(config) {
  // 处理不需要token的请求
  if (config.needToken === false) {
    return config
  }
  // token 为cookie自动携带

  return config
}

function reqReject(error) {
  return Promise.reject(error)
}

async function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    return Promise.reject({ code, message, error })
  }

  const { data, status, config } = error.response
  const code = data?.code ?? status

  const needTip = config?.needTip !== false
  const message = resolveResError(code, data?.message ?? error.message, needTip)
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}
