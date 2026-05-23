import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { fetchAlbumList, updateState } from '../../actions'
import Loading from '../../components/loading'

import './album.scss'

interface AlbumProps {
  onFetchAlbumList: (payload: { callback?: any, initOffset?: number, isInit?: boolean }) => any
  onUpdateState: (namespace: string, payload: any) => any
  album: StoreState.AlbumState
  loading: boolean
}

const mapStateToProps = ({ album, loading }) => ({
  album,
  loading: loading.effects['album/fetchAlbumList']
})

const mapDispatchToProps = {
  onFetchAlbumList: fetchAlbumList,
  onUpdateState: updateState
}

@connect(mapStateToProps, mapDispatchToProps)
class Album extends Component<AlbumProps, {}> {
  static options = {
    addGlobalClass: true
  }

  fetchAlbum(callback?: any, initOffset?: number, isInit?: boolean, isUnLoad?: boolean) {
    if (isUnLoad) return
    this.props.onFetchAlbumList({ callback, initOffset, isInit })
  }

  loadingMore() {
    const { onUpdateState, loading, album } = this.props
    const { offset } = album
    if (loading) return
    onUpdateState('album', { offset: offset + 1 })
    setTimeout(() => {
      this.fetchAlbum()
    })
  }

  navigateTo(url: string) {
    Taro.navigateTo({ url })
  }

  render() {
    const album = this.props.album || { albumList: [], total: 0 }
    const { albumList, total } = album

    if (this.props.loading && albumList.length === 0) {
      return <Loading />
    }

    return (
      <View className='album'>
        <ScrollView
          scrollY
          scrollTop={0}
          lowerThreshold={150}
          enableBackToTop
          onScrollToLower={this.loadingMore.bind(this)}
          className='item-list'>
          {
            albumList.map((data, k) => {
              return (
                <View onClick={this.navigateTo.bind(this, `/pages/albumDetail/albumDetail?id=${data.id}`)} key={k}>
                  <View className='album-itembox clearfix'>
                    <View className='cover'>
                      <Image src={data.picUrl} lazyLoad></Image>
                    </View>
                    <View className='info'>
                      <View className='name'>{data.name}</View>
                      <Text className='singer'>{data.singer}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          }
          {
            (albumList.length === total && albumList.length > 0) ?
              <View className='loadingend'>没有了~~</View> : null
          }
        </ScrollView>
      </View>
    )
  }
}

export default Album
