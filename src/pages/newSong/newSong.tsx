import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getCacheData } from '../../utils/index'
import {
  fetchNewestList,
  fetchSongById,
  updateState
} from '../../actions'

import './newSong.scss'

interface NewSongProps {
  main: StoreState.MainState;
  newSong: StoreState.NewSongState;
  onFetchNewestList: (payload: { callback: any }) => any;
  onFetchSongById: (payload: { id: number, restore: boolean }) => any;
  onUpdateState: (namespace: string, payload: any) => any;
}
const mapStateToProps = ({ main, newSong }) => ({
  main,
  newSong
})
const mapDispatchToProps = ({
  onFetchNewestList: fetchNewestList,
  onFetchSongById: fetchSongById,
  onUpdateState: updateState
})

@connect(mapStateToProps, mapDispatchToProps)
class NewSong extends Component<NewSongProps, {}> {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
  }
  getNewest() {
    let newestList = getCacheData('newSongList')
    if (newestList && newestList.length > 0) {
      this.props.onUpdateState('newSong', { newestList })
    }
  }
  fetchNewest(callback) {
    this.props.onFetchNewestList({ callback })
  }
  playSongById(id, restore) {
    this.props.onFetchSongById({ id, restore })
  }
  render() {
    const { currentSong } = this.props.main,
      { newestList } = this.props.newSong

    return (
      <View className='newest'>
        <View className='item-list'>
        {
          newestList.map((data, k) => {
            return (
              <View key={k} className={`song-itembox ${currentSong.id === data.id ? 'song-itembox-active' : ''}`}
                    onClick={this.playSongById.bind(this, data.id)}>
                <View className='cover'>
                  <Image src={data.song.album.picUrl} lazyLoad></Image>
                </View>
                <View className='info'>
                  <View className='name'>{data.song.name}</View>
                  <Text className='singer'>{data.song.artists[0].name}</Text>
                </View>
              </View>
            )
          })
        }
        </View>
      </View>
    )
  }
}

export default NewSong
