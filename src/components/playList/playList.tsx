import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { playOrderItem, PlayListProps } from "./playList.interface";

import './playList.scss'

const playOrderMap: Array<playOrderItem> = [
  {icon: 'icon-list-loop', name: '列表循环'},
  {icon: 'icon-single-loop', name: '单曲循环'},
  {icon: 'icon-bofangye-caozuolan-suijibofang', name: '随机播放'}
]
class PlayList extends Component<PlayListProps, {}> {
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
                    <Text className='info' onClick={onListToPlay.bind(this, data.id)}>{data.name}<Text> - {data.ar}</Text></Text>
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

export default PlayList
