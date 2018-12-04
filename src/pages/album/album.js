import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Action from '../../utils/action'

import './album.scss'

@connect(({ album, loading }) => ({
  ...album,
  loading: loading.effects['album/fetchAlbumList']
}))
class Album extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
  }
  /**
   * 获取新碟数据
   * @param callback 回调
   * @param initOffset 初始页码
   * @param isInit 是否初始化
   * @param isUnLoad 是否不加载请求数据
   */
  fetchAlbum(callback, initOffset, isInit, isUnLoad) {
    if (isUnLoad) return
    const { dispatch } = this.props
    dispatch(Action('album/fetchAlbumList', { callback, initOffset, isInit }))
  }

  loadingMore() {
    const { dispatch, loading, offset } = this.props
    if (loading) return
    dispatch(Action('album/updateState', { offset: offset + 1 }))
    setTimeout(() => {
      this.fetchAlbum()
    })
  }

  navigateTo(url) {
    Taro.redirectTo({url: url})
  }

  render() {
    let { albumList, total } = this.props
    return (
      <View className='album'>
        <ScrollView
          scrollY
          scrollTop='0'
          lowerThreshold='150'
          enableBackToTop
          onScrollToLower={this.loadingMore}
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
            (albumList.length == total && albumList.length > 0) ?
              <View className='loadingend'>没有了~~</View> : null
          }
        </ScrollView>
      </View>
    )
  }
}

export default Album
