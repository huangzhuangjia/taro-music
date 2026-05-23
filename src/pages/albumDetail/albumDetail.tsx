import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
import { getAlbumDetail } from '../../services/index'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import { fetchSongById } from '../../actions'
import Loading from '../../components/loading'

import '../listDetail/listDetail.scss'

interface AlbumDetailProps {
  main: StoreState.MainState
  onFetchSongById: (payload: { id: number, restore?: boolean }) => any
}

interface AlbumDetailStates {
  album: any
  songs: any[]
  scrollState: boolean
  loading: boolean
}

const mapStateToProps = ({ main }) => ({
  main
})

const mapDispatchToProps = {
  onFetchSongById: fetchSongById
}

@connect(mapStateToProps, mapDispatchToProps)
class AlbumDetail extends Component<AlbumDetailProps, AlbumDetailStates> {
  constructor(props: AlbumDetailProps) {
    super(props)
    this.state = {
      album: {},
      songs: [],
      scrollState: false,
      loading: true
    }
  }

  componentDidShow() {
    const commonBar = this.refs.commonBar as any
    commonBar && commonBar.registerAsPlayerHost && commonBar.registerAsPlayerHost()
  }

  componentDidMount() {
    this.getListDetail()
  }

  getListDetail() {
    const params = Taro.getCurrentInstance().router?.params
    const id = params?.id
    if (!id) {
      this.setState({ loading: false })
      return
    }
    getAlbumDetail({ id }).then(res => {
      if (res.code === 200) {
        this.setState({
          songs: res.songs,
          album: res.album,
          loading: false
        })
      } else {
        this.setState({ loading: false })
      }
    }).catch(() => {
      this.setState({ loading: false })
    })
  }

  playSongById(id: number, restore?: boolean) {
    this.props.onFetchSongById({ id, restore })
  }

  scroll(e) {
    const top = e.detail.scrollTop
    if (top > 200) {
      if (!this.state.scrollState) {
        this.setState({ scrollState: true })
      }
    } else if (this.state.scrollState) {
      this.setState({ scrollState: false })
    }
  }

  saveToList() {
    const songs = this.state.songs
    const item: Array<StoreState.playItemState> = []
    songs.forEach((data) => {
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
    const { songs, album, loading } = this.state
    const currentSong = this.props.main.currentSong || {}
    const winHeight = Taro.getWindowInfo().windowHeight

    if (loading) {
      return <Loading />
    }

    return (
      <View className='listDetail-wrapper'>
        <ScrollView
          className='wrap'
          scrollY
          scrollTop={0}
          onScroll={this.scroll.bind(this)}
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
        <CommonBar ref='commonBar' />
      </View>
    )
  }
}

export default AlbumDetail
