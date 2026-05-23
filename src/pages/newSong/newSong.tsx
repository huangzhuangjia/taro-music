import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { getCacheData } from '../../utils/index'
import {
  fetchNewestList,
  fetchSongById,
  updateState
} from '../../actions'

import './newSong.scss'
import Loading from '../../components/loading'

interface NewSongProps {
  main: StoreState.MainState
  newSong: StoreState.NewSongState
  loading: boolean
  onFetchNewestList: (payload: { callback?: any }) => any
  onFetchSongById: (payload: { id: number; restore: boolean }) => any
  onUpdateState: (namespace: string, payload: any) => any
}

const mapStateToProps = ({ main, newSong, loading }) => ({
  main,
  newSong,
  loading: loading.effects['newSong/fetchNewestList']
})

const mapDispatchToProps = {
  onFetchNewestList: fetchNewestList,
  onFetchSongById: fetchSongById,
  onUpdateState: updateState
}

@connect(mapStateToProps, mapDispatchToProps)
class NewSong extends Component<NewSongProps, {}> {
  static options = {
    addGlobalClass: true
  }

  getNewest() {
    const newestList = getCacheData('newSongList')
    if (newestList && newestList.length > 0) {
      this.props.onUpdateState('newSong', { newestList })
    }
  }

  fetchNewest(callback?: () => void) {
    this.props.onFetchNewestList({ callback })
  }

  playSongById = (id: number) => {
    this.props.onFetchSongById({ id, restore: false })
  }

  render() {
    const { currentSong } = this.props.main || { currentSong: {} as any }
    const { newestList = [] } = this.props.newSong || {}

    if (this.props.loading) {
      return <Loading />
    }

    return (
      <View className='newest'>
        <ScrollView
          className='item-list'
          scrollY
          enableBackToTop
          scrollWithAnimation
        >
          {newestList.map((data, k) => (
            <View
              key={k}
              className={`song-itembox ${currentSong.id === data.id ? 'song-itembox-active' : ''}`}
              onClick={() => this.playSongById(data.id)}
            >
              <View className='cover'>
                <Image src={data.song.album.picUrl} lazyLoad />
              </View>
              <View className='info'>
                <View className='name'>{data.song.name}</View>
                <Text className='singer'>{data.song.artists[0].name}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

export default NewSong
