import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
import { getAlbumDetail } from '../../services/index'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import { fetchSongById } from '../../actions'
import Loading from '../../components/loading'

import '../listDetail/listDetail.scss'

interface AlbumDetailProps {
  main: StoreState.MainState,
  onFetchSongById: (payload: { id: number, restore: boolean }) => any,
}
interface AlbumDetailStates {
  album: any,
  songs: any,
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
class AlbumDetail extends Component<AlbumDetailProps, AlbumDetailStates> {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
    this.state = {
      album: {},
      songs: [],
      scrollState: false,
      loading: true
    }
  }

  componentWillPreload(params) {
    return getAlbumDetail({
      id: params.id
    })
  }

  componentDidMount() {
    this.getListDetail()
  }

  getListDetail() {
    this.$preloadData.then(res => {
      if (res.code === 200) {
        this.setState({
          songs: res.songs,
          album: res.album,
          loading: false
        })
      }
    })
  }

  playSongById(id, restore) {
    this.props.onFetchSongById({ id, restore })
  }

  scroll(e) {
    let top = e.detail.scrollTop
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
  }

  saveToList() {
    let songs = this.state.songs
    let item: Array<StoreState.playItemState> = []
    songs.map((data) => {
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
    let { songs, album, loading } = this.state,
      currentSong = this.props.main.currentSong || {},
      winHeight = Taro.getSystemInfoSync().windowHeight
    if (loading) {
      return <Loading/>
    }
    return (
      <View className='listDetail-wrapper'>
        {/* <View className={`windowsHead ${scrollState ? '' : 'windowsHead-transparent'}`}>
          <View className='back iconfont icon-fanhui' onClick={this.goBack.bind(this)}></View>
        </View> */}
        <ScrollView
          className='wrap'
          scrollY
          scrollTop='0'
          onScroll={this.scroll}
          style={{ height: `${winHeight}px` }}>
        <View className='listCoverBanner'>
          <View className='play iconfont icon-tianjiaqiyedangan' onClick={this.saveToList.bind(this)}></View>
            <View className='cover'>
              <Image src={album.picUrl || ''} mode='widthFix'></Image>
            </View>
          </View>
          <View className='listInfo'>
            <View className='name'>{album.name || ''}</View>
            <View className='desc'>{album.company || ''}</View>
          </View>
          <View className='song-list'>
            {
              songs.map((data, k) => {
                return (
                  <View className={`song ${currentSong.id == data.id ? 'song-active' : ''}`} key={k} onClick={this.playSongById.bind(this, data.id)}>
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

export default AlbumDetail
