import { Component, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import Taro from '@tarojs/taro'

import dva from './dva'
import models from './models/index'
import { setGlobalData } from './utils'

import './app.scss'
import './assets/icon.css'

const dvaApp = dva.createApp({
  initialState: {},
  models
})
const store = dvaApp.getStore()

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    setGlobalData('backgroundAudioManager', Taro.getBackgroundAudioManager())
  }

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
