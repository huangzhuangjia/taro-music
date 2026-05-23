export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/listDetail/listDetail',
    'pages/albumDetail/albumDetail'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F2F2F7',
    navigationBarTitleText: 'JMusic',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F2F2F7'
  },
  lazyCodeLoading: 'requiredComponents',
  requiredBackgroundModes: ['audio']
})

function defineAppConfig(config: Taro.AppConfig) {
  return config
}
