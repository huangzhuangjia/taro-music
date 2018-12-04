import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import PropTypes from 'prop-types'

import './playList.scss'

const playOrderMap = [
  {icon: 'icon-list-loop', name: '列表循环'},
  {icon: 'icon-single-loop', name: '单曲循环'},
  {icon: 'icon-bofangye-caozuolan-suijibofang', name: '随机播放'}
];
const propTypes = {
  playList: PropTypes.array,
  playListState: PropTypes.bool,
  playOrder: PropTypes.number,
  currentSong: PropTypes.object,
  onClose: PropTypes.func,
  switchOrder: PropTypes.func,
  delList: PropTypes.func,
  listToPlay: PropTypes.func,
}
const defaultProps = {
  playList: [],
  playListState: false,
  playOrder: 0,
  currentSong: {},
  onClose: () => {},
  onSwitchOrder: () => {},
  onDelList: () => {},
  onListToPlay: () => {},
}

class PlayList extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
  }
  render() {
    let {
      playList,
      playListState,
      playOrder,
      currentSong,
      onClose,
      onSwitchOrder,
      onDelList,
      onListToPlay
    } = this.props
    return (
      <View className={`play-list-dialog ${playListState ? 'play-list-dialog-active' : ''}`}>
        <View className={`mask ${playListState ? 'mask-active' : ''}`} onClick={onClose.bind(this)}></View>
        <View className={`list-wrap ${playListState ? 'list-wrap-active' : ''}`}>
          <View className='list-wrap-head'>
            <View className='label' onClick={onSwitchOrder.bind(this)}>
              <View className={`iconfont ${playOrderMap[playOrder].icon}`}></View>
              <Text>{playOrderMap[playOrder].name} ({playList.length || 0})</Text>
            </View>
            <View className='clear iconfont icon-shanchu' onClick={onDelList.bind(this, 'all')}></View>
          </View>
          <ScrollView scrollY className='list-item' ref="songListItem">
            {
              playList.map((data, k) => {
                return (
                  <View className={`${currentSong.id === data.id ? 'row-playing' : ''} row`} key={k}>
                    <Text className='info' onClick={onListToPlay.bind(this, data)}>{data.name}<Text> - {data.ar}</Text></Text>
                    <View className='del iconfont icon-guanbi' onClick={onDelList.bind(this, data.id, k)}></View>
                  </View>
                )
              })
            }
          </ScrollView>
          <View className='list-wrap-foot' onClick={onClose.bind(this)}>关闭</View>
        </View>
      </View>
    )
  }
}

PlayList.propTypes = propTypes
PlayList.defaultProps = defaultProps
export default PlayList
