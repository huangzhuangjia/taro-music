// 播放控制条
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Canvas } from '@tarojs/components'
import coverImg from '../../assets/image/logo.png'
import './controlBar.scss'

interface ControlBarProps {
  isUIPage: boolean;
  playState: boolean;
  songInfo: any;
  transform: string;
  onToUIPage: () => any
  onSwitchPlay: (state: boolean) => any
  onTargetingCur: () => any
}

class ControlBar extends Component<ControlBarProps, {}> {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
  }
  render() {
    let {
      isUIPage,
      playState,
      songInfo,
      transform,
      onToUIPage,
      onSwitchPlay,
      onTargetingCur
    } = this.props
    return (
      <View className={`fix-control ${isUIPage ? '' : 'fix-control-active'}`}>
        <View className='cover' onClick={onToUIPage.bind(this)}>
          <Image src={songInfo.al.picUrl || coverImg} style={playState ? transform : ''}></Image>
        </View>
        <View className='info' onClick={onToUIPage.bind(this)}>
          <View className='name'>{songInfo.name || ''}</View>
          <Text className='singer'>
            {(songInfo.ar && songInfo.ar[0].name) || ''}
          </Text>
        </View>
        <View className='play-icon' onClick={onSwitchPlay.bind(this, !playState)}>
          <View className={`icon iconfont ${playState ? 'icon-weibiaoti519' : 'icon-bofang2'}`}></View>
          <Canvas className='progress' id='progress' canvasId='progress'></Canvas>
        </View>
        <View className='play-list iconfont icon-liebiao' onClick={onTargetingCur.bind(this)}></View>
      </View>
    )
  }
}

export default ControlBar
