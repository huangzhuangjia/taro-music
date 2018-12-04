// 播放控制条
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Canvas } from '@tarojs/components'
import PropTypes from 'prop-types'
import coverImg from '../../assets/image/logo.png'
import './controlBar.scss'

const propTypes = {
  isUIPage: PropTypes.bool,
  playState: PropTypes.bool,
  songInfo: PropTypes.object,
  transform: PropTypes.string,
  onToUIPage: PropTypes.func,
  onSwitchPlay: PropTypes.func,
  onTargetingCur: PropTypes.func
}
const defaultProps = {
  isUIPage: false,
  playState: false,
  songInfo: {},
  transform: '',
  onToUIPage: () => {},
  onSwitchPlay: () => {},
  onTargetingCur: () => {}
}

class ControlBar extends Component {
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

ControlBar.propTypes = propTypes
ControlBar.defaultProps = defaultProps
export default ControlBar
