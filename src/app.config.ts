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
  }
})

function defineAppConfig(config: Taro.AppConfig) {
  return config
}
