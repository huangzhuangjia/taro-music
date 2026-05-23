import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import Recommend from '../recommend/recommend'
import NewSong from '../newSong/newSong'
import Album from '../album/album'
import { getCacheData, setCacheData } from '../../utils/index'
import {
  fetchRecommendList,
  fetchNewestList,
  fetchAlbumList,
  updateState
} from '../../actions'

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

interface IndexProps {
  onFetchRecommendList: (payload: { callback?: any }) => any
  onFetchNewestList: (payload: { callback?: any }) => any
  onFetchAlbumList: (payload: { callback?: any, initOffset?: number, isInit?: boolean }) => any
  onUpdateState: (namespace: string, payload?: any) => any
}

interface IndexStates {
  activeTab: number
  tabs: Array<TabItem>
}

const mapDispatchToProps = {
  onFetchRecommendList: fetchRecommendList,
  onFetchNewestList: fetchNewestList,
  onFetchAlbumList: fetchAlbumList,
  onUpdateState: updateState
}

@connect(null, mapDispatchToProps)
class Index extends Component<IndexProps, IndexStates> {
  state = {
    activeTab: 0,
    tabs: [...tabs]
  }

  componentDidMount() {
    this.loadInitialData()
  }

  loadInitialData() {
    const { onFetchRecommendList, onFetchNewestList, onFetchAlbumList, onUpdateState } = this.props
    const tab = Taro.getCurrentInstance().router?.params?.tab

    const recommendList = getCacheData('recommendList')
    if (recommendList && recommendList.length > 0) {
      onUpdateState('recommend', { recommendList })
    } else {
      onFetchRecommendList({})
    }

    const newestList = getCacheData('newSongList')
    if (newestList && newestList.length > 0) {
      onUpdateState('newSong', { newestList })
    }

    if (!tab) {
      const albumList = getCacheData('albumList')
      if (albumList && albumList.length > 0) {
        onUpdateState('album', { albumList })
      }
      onFetchAlbumList({ isInit: false })
    }
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

  switchTab = (index: number) => {
    if (this.state.activeTab === index) return
    this.setState({ activeTab: index })

    const { onFetchRecommendList, onFetchNewestList, onFetchAlbumList } = this.props
    switch (index) {
      case 0:
        if (!this.isCache().recommend) {
          onFetchRecommendList({})
        }
        break
      case 1:
        if (!this.isCache().newSong) {
          onFetchNewestList({})
        }
        break
      case 2:
        if (!this.isCache().album) {
          onFetchAlbumList({ isInit: false })
        }
        break
      default:
        break
    }
  }

  stopPullDownRefresh() {
    Taro.stopPullDownRefresh()
  }

  refresh() {
    const { onFetchRecommendList, onFetchNewestList, onFetchAlbumList, onUpdateState } = this.props
    const activeTab = this.state.activeTab

    switch (activeTab) {
      case 0:
        setCacheData('recommendList', [])
        onFetchRecommendList({ callback: this.stopPullDownRefresh })
        break
      case 1:
        setCacheData('newSongList', [])
        onFetchNewestList({ callback: this.stopPullDownRefresh })
        break
      case 2:
        setCacheData('albumList', [])
        onUpdateState('album', { offset: 0 })
        onFetchAlbumList({ callback: this.stopPullDownRefresh, initOffset: 0, isInit: true })
        break
      default:
        break
    }
  }

  render() {
    const { activeTab } = this.state

    return (
      <View className='play-wrapper wrapper'>
        <View className='home-wrapper'>
          <View className='home-tab'>
            {
              this.state.tabs.map((data, k) => {
                return (
                  <View
                    key={k}
                    className={`tab ${activeTab === k ? 'cur' : ''}`}
                    onClick={() => this.switchTab(k)}
                  >
                    {data.title}
                  </View>
                )
              })
            }
          </View>
          <View className='home-tab-wrapper'>
            <View className='tab-panel'>
              {activeTab === 0 && <Recommend />}
              {activeTab === 1 && <NewSong />}
              {activeTab === 2 && <Album />}
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
