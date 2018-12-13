import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import Recommend from '../recommend/recommend'
import NewSong from '../newSong/newSong'
import Album from '../album/album'
import { getCacheData, setCacheData } from '../../utils/index'

import './index.scss'

interface TabItem {
  id: number;
  title: string
}
const tabs: Array<TabItem> = [
  {id: 0, title: '推荐歌单'},
  {id: 1, title: '最新单曲'},
  {id: 2, title: '新碟上架'},
]

interface IndexStates {
  activeTab: number;
  tabs: Array<TabItem>
}
class Index extends Component<{}, IndexStates> {
  constructor() {
    super(...arguments)
    this.state = {
      activeTab: 0,
      tabs: [...tabs]
    }
  }
  componentWillMount() {
    this.setState({
      activeTab: parseInt(this.$router.params.tab) || 0
    })
  }
  componentDidMount() {
    this.getCacheList()
  }
  getCacheList() {
    this.refs.Recommend.getRecommendList()
    this.refs.NewSong.getNewest()
    this.refs.Album.fetchAlbum(null, null, false, !!this.$router.params.tab)
  }
  // 下拉刷新
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
  switchTab(index, init) {
    if (this.state.activeTab === index && !init) return
    this.setState({
      activeTab: index
    })
    switch (index) {
      case 0:
        !this.isCache().recommend && this.refs.Recommend.fetchRecommendList()
        break
      case 1:
        !this.isCache().newSong && this.refs.NewSong.fetchNewest()
        break
      case 2:
        this.refs.Album.fetchAlbum(null, null, false, true)
        break
      default:
        break;
    }
  }
  navigateTo(url) {
    Taro.navigateTo({url: url})
  }
  // 停止下拉刷新
  stopPullDownRefresh() {
    Taro.stopPullDownRefresh()
  }
  // 刷新数据
  refresh() {
    let activeTab = this.state.activeTab
    switch (activeTab) {
      case 0:
        setCacheData('newSongList', [])
        this.refs.Recommend.fetchRecommendList(this.stopPullDownRefresh)
        break
      case 1:
        setCacheData('recommendList', [])
        this.refs.NewSong.fetchNewest(this.stopPullDownRefresh)
        break
      case 2:
        setCacheData('albumList', [])
        this.refs.Album.fetchAlbum(this.stopPullDownRefresh, 0, true)
        break
      default:
        break
    }
  }
  render() {
    return (
      <View className='play-wrapper wrapper'>
        {/* 主体 */}
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
              <View className='swiper-slide' hidden={this.state.activeTab == 0 ? false : true}>
                <Recommend ref='Recommend' />
              </View>
              <View className='swiper-slide' hidden={this.state.activeTab == 1 ? false : true}>
                <NewSong ref='NewSong' />
              </View>
              <View className='swiper-slide' hidden={this.state.activeTab == 2 ? false : true}><Album ref='Album' /></View>
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
