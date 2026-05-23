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

/** /personalized/newsong 条目：播放与展示统一用 song.id */
function getTrackId(item: any): number {
  return item?.song?.id ?? item?.id
}

function getCoverUrl(song: any): string {
  return song?.al?.picUrl || song?.album?.picUrl || ''
}

function getArtistName(song: any): string {
  const ar = song?.ar || song?.artists
  return ar?.[0]?.name || ''
}

@connect(mapStateToProps, mapDispatchToProps)
class NewSong extends Component<NewSongProps, {}> {
  static options = {
    addGlobalClass: true
  }

  getNewest() {
    const newestList = getCacheData('newSongList')
    if (newestList && newestList.length > 0) {
      const normalized = newestList.map((item: any) => ({
        ...item,
        id: getTrackId(item)
      }))
      this.props.onUpdateState('newSong', { newestList: normalized })
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
          {newestList.map((data, k) => {
            const songId = getTrackId(data)
            const song = data.song || {}
            return (
              <View
                key={songId || k}
                className={`song-itembox ${currentSong.id === songId ? 'song-itembox-active' : ''}`}
                onClick={() => this.playSongById(songId)}
              >
                <View className='cover'>
                  <Image src={getCoverUrl(song)} lazyLoad />
                </View>
                <View className='info'>
                  <View className='name'>{song.name}</View>
                  <Text className='singer'>{getArtistName(song)}</Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

export default NewSong
