import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import dva from './dva'
import models from './models'
import Index from './pages/index'

import { setGlobalData, getCacheData } from './utils'
import eventEmitter from './utils/eventEmitter'
import * as Events from './constants/event-types'

import './app.scss'
import './assets/icon.css'

const dvaApp = dva.createApp({
  initialState: {},
  models: models
})
const store = dvaApp.getStore()

const backgroundAudioManager = Taro.getBackgroundAudioManager()

class App extends Component {

  config = {
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

  componentDidShow() {}

  componentDidHide() {
    // 小程序退出时主动暂停音乐
    eventEmitter.trigger(Events.HIDE, backgroundAudioManager)
  }

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
