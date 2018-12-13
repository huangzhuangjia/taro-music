import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import dva from './dva'
import models from './models/index'
import Index from './pages/index/index'

import { setGlobalData } from './utils'

import './app.scss'
import './assets/icon.css'

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

const backgroundAudioManager = Taro.getBackgroundAudioManager()

class App extends Component {

  config: Config = {
    pages: [
      'pages/index/index',
      'pages/listDetail/listDetail',
      'pages/albumDetail/albumDetail'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'JMusic',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    }
  }

  componentDidMount() {
    setGlobalData('backgroundAudioManager', backgroundAudioManager)
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
