import { Component, createRef } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import Recommend from '../recommend/recommend'
import NewSong from '../newSong/newSong'
import Album from '../album/album'
import { getCacheData, setCacheData } from '../../utils/index'

import './index.scss'

interface TabItem {
  id: number
  title: string
}

const tabs: Array<TabItem> = [
  { id: 0, title: '推荐歌单' },
  { id: 1, title: '最新单曲' },
  { id: 2, title: '新碟上架' },
]

interface IndexStates {
  activeTab: number
  tabs: Array<TabItem>
}

class Index extends Component<{}, IndexStates> {
  private recommendRef = createRef<Recommend>()
  private newSongRef = createRef<NewSong>()
  private albumRef = createRef<Album>()

  state = {
    activeTab: 0,
    tabs: [...tabs]
  }

  componentDidMount() {
    this.loadInitialData()
  }

  loadInitialData() {
    const tab = Taro.getCurrentInstance().router?.params?.tab
    this.recommendRef.current?.getRecommendList()
    this.newSongRef.current?.getNewest()
    this.albumRef.current?.fetchAlbum(undefined, undefined, false, !!tab)
  }

  onPullDownRefresh() {
    this.refresh()
  }

  isCache() {
    return {
      newSong: getCacheData('newSongList') && getCacheData('newSongList').length > 0,
      recommend: getCacheData('recommendList') && getCacheData('recommendList').length > 0,
      album: getCacheData('albumList') && getCacheData('albumList').length > 0,
    }
  }

  switchTab(index: number, init?: boolean) {
    if (this.state.activeTab === index && !init) return
    this.setState({
      activeTab: index
    })
    switch (index) {
      case 0:
        !this.isCache().recommend && this.recommendRef.current?.fetchRecommendList()
        break
      case 1:
        !this.isCache().newSong && this.newSongRef.current?.fetchNewest()
        break
      case 2:
        this.albumRef.current?.fetchAlbum(undefined, undefined, false, true)
        break
      default:
        break
    }
  }

  stopPullDownRefresh() {
    Taro.stopPullDownRefresh()
  }

  refresh() {
    const activeTab = this.state.activeTab
    switch (activeTab) {
      case 0:
        setCacheData('recommendList', [])
        this.recommendRef.current?.fetchRecommendList(this.stopPullDownRefresh)
        break
      case 1:
        setCacheData('newSongList', [])
        this.newSongRef.current?.fetchNewest(this.stopPullDownRefresh)
        break
      case 2:
        setCacheData('albumList', [])
        this.albumRef.current?.fetchAlbum(this.stopPullDownRefresh, 0, true)
        break
      default:
        break
    }
  }

  render() {
    return (
      <View className='play-wrapper wrapper'>
        <View className='home-wrapper'>
          <View className='home-tab'>
            {
              this.state.tabs.map((data, k) => {
                return (
                  <View key={k} className={`tab ${this.state.activeTab === k ? 'cur' : ''}`} onClick={this.switchTab.bind(this, k)}>{data.title}</View>
                )
              })
            }
          </View>
          <View className='home-tab-wrapper'>
            <View className='swiper-wrapper'>
              <View className='swiper-slide' hidden={this.state.activeTab !== 0}>
                <Recommend ref={this.recommendRef} />
              </View>
              <View className='swiper-slide' hidden={this.state.activeTab !== 1}>
                <NewSong ref={this.newSongRef} />
              </View>
              <View className='swiper-slide' hidden={this.state.activeTab !== 2}>
                <Album ref={this.albumRef} />
              </View>
            </View>
          </View>
        </View>
        <PlayDetail />
        <CommonBar />
      </View>
    )
  }
}

export default Index
