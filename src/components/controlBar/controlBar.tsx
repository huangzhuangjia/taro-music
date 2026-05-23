// 播放控制条
import { Component } from 'react'
import { View, Text, Image, Canvas } from '@tarojs/components'
import { ControlBarProps } from './controlBar.interface'
import coverImg from '../../assets/image/logo.png'
import './controlBar.scss'

class ControlBar extends Component<ControlBarProps, {}> {
  static options = {
    addGlobalClass: true
  }

  render() {
    const {
      visible,
      isUIPage,
      playState,
      songInfo,
      transform,
      onToUIPage,
      onSwitchPlay,
      onTargetingCur
    } = this.props

    const showBar = visible && !isUIPage

    return (
      <View className={`fix-control ${showBar ? 'fix-control-active' : ''}`}>
        <View className='cover' onClick={onToUIPage.bind(this)}>
          <Image src={songInfo.al.picUrl || coverImg} style={playState ? transform : ''} />
        </View>
        <View className='info' onClick={onToUIPage.bind(this)}>
          <View className='name'>{songInfo.name || ''}</View>
          <Text className='singer'>{(songInfo.ar && songInfo.ar[0].name) || ''}</Text>
        </View>
        <View className='play-icon' onClick={onSwitchPlay.bind(this, !playState)}>
          <View className={`icon iconfont ${playState ? 'icon-weibiaoti519' : 'icon-bofang2'}`} />
          <Canvas className='progress' id='progress' canvasId='progress' />
        </View>
        <View className='play-list iconfont icon-liebiao' onClick={onTargetingCur.bind(this)} />
      </View>
    )
  }
}

export default ControlBar
