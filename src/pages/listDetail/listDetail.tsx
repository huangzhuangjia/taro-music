import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getPlayList } from '../../services'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import { fetchSongById } from '../../actions'
import Loading from '../../components/loading'

import './listDetail.scss'

interface ListDetailProps {
  main: StoreState.MainState;
  onFetchSongById: (payload: { id: number, restore: boolean }) => any
}
interface ListDetailStates {
  listData: any;
  scrollState: boolean,
  loading: boolean
}
const mapStateToProps = ({ main }) => ({
  main
})
const mapDispatchToProps = ({
  onFetchSongById: fetchSongById
})

@connect(mapStateToProps, mapDispatchToProps)
class ListDetail extends Component<ListDetailProps, ListDetailStates> {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
    this.state = {
      listData: {},
      scrollState: false,
      loading: true
    }
  }
  componentWillPreload(params) {
    return getPlayList({
      id: params.id
    })
  }
  componentDidMount() {
    this.fetchListDetail()
  }
  fetchListDetail() {
    this.$preloadData.then(res => {
      if (res.code === 200) {
        this.setState({
          listData: res.playlist,
          loading: false
        })
      }
    })
  }
  playSongById(id, restore) {
    this.props.onFetchSongById({ id, restore })
  }
  scroll(event) {
    let top = event.detail.scrollTop
    if (top > 200) {
      if (!this.state.scrollState) {
        this.setState({
          scrollState: true,
        })
      }
    } else {
      if (this.state.scrollState) {
        this.setState({
          scrollState: false,
        })
      }
    }
  }

  goBack() {
    Taro.navigateBack()
    // Taro.redirectTo({url: '/pages/index/index'})
  }
  saveToList() {
    let tracks = this.state.listData.tracks || []
    let item: Array<StoreState.playItemState> = []
    tracks.map((data) => {
      item.push({
        id: data.id,
        name: data.name || '',
        ar: data.ar[0].name || '',
        cover: data.al.picUrl,
        from: 'online'
      })
    })
    eventEmitter.trigger(Events.BATCHADD, item)
  }
  render() {
    let { listData, loading } = this.state
    let tracks = listData.tracks || []
    let currentSong = this.props.main.currentSong || {}
    let winHeight = Taro.getSystemInfoSync().windowHeight
    if (loading) {
      return <Loading/>
    }
    return (
      <View className='listDetail-wrapper wrapper'>
        {/* <View className={`windowsHead ${scrollState ? 'windowsHead-shadow' : 'windowsHead-transparent'}`}> */}
          {/* <View className='back iconfont icon-fanhui' onClick={this.goBack.bind(this)}></View> */}
        {/*  </View> */}
        <ScrollView
          scrollY
          scrollTop='0'
          onScroll={this.scroll}
          className='wrap'
          style={{ height: `${winHeight}px` }}>
          <View className='listCoverBanner'>
            <View className='play iconfont icon-tianjiaqiyedangan' onClick={this.saveToList.bind(this)}></View>
            <View className='cover'>
              <Image src={listData.coverImgUrl || ''} mode='widthFix'></Image>
            </View>
          </View>
          <View className='listInfo'>
            <View className='name'>{listData.name || ''}</View>
            <View className='desc'>{listData.description || ''}</View>
          </View>
          <View className='song-list'>
            {
              tracks.map((data, k) => {
                return (
                  <View className={`song ${currentSong.id === data.id ? 'song-active' : ''}`} key={k} onClick={this.playSongById.bind(this, data.id)}>
                    <View className='key'>{k + 1}</View>
                    <View className='r'>
                      <View className='name'>{data.name || ''}</View>
                      <View className='singer'>{data.ar[0].name || ''}</View>
                    </View>
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        <PlayDetail />
        <CommonBar />
      </View>
    )
  }
}

export default ListDetail
