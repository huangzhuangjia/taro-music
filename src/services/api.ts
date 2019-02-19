import Taro from '@tarojs/taro'
import qs from 'qs'
import {
  BASE_URL,
  HTTP_ERROR
} from '../config/index'

/**
 * 检查http状态值
 * @param response
 * @returns {*}
 */
function checkHttpStatus(response: API.Response) {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response.data
  }

  const message = HTTP_ERROR[response.statusCode] || `ERROR CODE: ${response.statusCode}`
  const error: any = new Error(message)
  error.response = response
  throw error
}

/**
 * 检查返回值是否正常
 * @param data
 * @returns {*}
 */
function checkSuccess(data: any, resolve) {
  if (data instanceof ArrayBuffer && typeof data === 'string') {
    return data
  }

  if (
    typeof data.code === 'number' &&
    data.code === 200
  ) {
    return resolve(data)
  }

  const error: any = new Error(data.message || '服务端返回异常')
  error.data = data
  throw error
}

/**
 * 请求错误处理
 * @param error
 * @param reject
 */
function throwError(error, reject) {
  if (error.errMsg) {
    reject('服务器正在维护中!')
    throw new Error('服务器正在维护中!')
  }
  throw error
}

export default {
  request(options: any, method?: string) {
    const { url } = options

    return new Promise((resolve, reject) => {
      Taro.request({
        ...options,
        method: method || 'GET',
        url: `${BASE_URL}${url}`,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          ...options.header
        },
      }).then(checkHttpStatus)
        .then((res) => {
          checkSuccess(res, resolve)
        })
        .catch(error => {
          throwError(error, reject)
        })
    })
  },
  get(options: any) {
    return this.request({
      ...options
    })
  },
  post(options: any) {
    return this.request({
      ...options,
      data: qs.stringify(options.data)
    }, 'POST')
  }
}
