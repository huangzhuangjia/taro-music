import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'
import { getCacheData } from '../../utils'

import './newSong.scss'

@connect(({ main, newSong }) => ({
  ...main,
  ...newSong
}))
class NewSong extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
  }
  getNewest() {
    const { dispatch } = this.props
    let newestList = getCacheData('newSongList')
    if (newestList && newestList.length > 0) {
      dispatch(Action('newSong/updateState', { newestList }))
    }
  }
  fetchNewest(callback) {
    const { dispatch } = this.props
    dispatch(Action('newSong/fetchNewestList', { callback }))
  }
  playSongById(id, restore) {
    const { dispatch } = this.props
    dispatch(Action('main/fetchSongById', {id, restore}))
  }
  render() {
    const { newestList, currentSong } = this.props

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
