export const IS_DEV = process.env.NODE_ENV === 'development'

// 本地开发：npm run api 启动 NeteaseCloudMusicApi（默认 3000 端口）
// 生产环境：在 .env.production 配置 TARO_APP_API 并在微信公众平台配置 request 合法域名
export const BASE_URL = process.env.TARO_APP_API || 'http://127.0.0.1:3000'

export const HTTP_ERROR: Record<number | string, string> = {
  '400': '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  '401': '用户没有权限（令牌、用户名、密码错误）。',
  '403': '用户得到授权，但是访问是被禁止的。',
  '404': '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  '406': '请求的格式不可得。',
  '410': '请求的资源被永久删除，且不会再得到的。',
  '422': '当创建一个对象时，发生一个验证错误。',
  '500': '服务器发生错误，请检查服务器。',
  '502': '网关错误。',
  '503': '服务不可用，服务器暂时过载或维护。',
  '504': '网关超时。',
}
