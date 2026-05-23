export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/listDetail/listDetail',
    'pages/albumDetail/albumDetail'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'JMusic',
    navigationBarTextStyle: 'black'
  },
  // 按需注入：仅注入当前页面所需的自定义组件与页面代码
  // https://developers.weixin.qq.com/miniprogram/dev/framework/ability/lazyload.html
  lazyCodeLoading: 'requiredComponents',
  // 后台音频播放能力声明
  requiredBackgroundModes: ['audio']
})

function defineAppConfig(config: Taro.AppConfig) {
  return config
}
