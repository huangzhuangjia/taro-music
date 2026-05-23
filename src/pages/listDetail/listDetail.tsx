import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { getPlayList } from '../../services'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
import CommonBar from '../../components/commonBar/index'
import PlayDetail from '../playDetail/playDetail'
import { fetchSongById } from '../../actions'
import Loading from '../../components/loading'

import './listDetail.scss'

interface ListDetailProps {
  main: StoreState.MainState
  onFetchSongById: (payload: { id: number, restore?: boolean }) => any
}

interface ListDetailStates {
  listData: any
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
class ListDetail extends Component<ListDetailProps, ListDetailStates> {
  constructor(props: ListDetailProps) {
    super(props)
    this.state = {
      listData: {},
      scrollState: false,
      loading: true
    }
  }

  componentDidMount() {
    this.fetchListDetail()
  }

  fetchListDetail() {
    const params = Taro.getCurrentInstance().router?.params
    const id = params?.id
    if (!id) {
      this.setState({ loading: false })
      return
    }
    getPlayList({ id }).then(res => {
      if (res.code === 200) {
        this.setState({
          listData: res.playlist,
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

  scroll(event) {
    const top = event.detail.scrollTop
    if (top > 200) {
      if (!this.state.scrollState) {
        this.setState({ scrollState: true })
      }
    } else if (this.state.scrollState) {
      this.setState({ scrollState: false })
    }
  }

  saveToList() {
    const tracks = this.state.listData.tracks || []
    const item: Array<StoreState.playItemState> = []
    tracks.forEach((data) => {
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
    const { listData, loading } = this.state
    const tracks = listData.tracks || []
    const currentSong = this.props.main.currentSong || {}
    const winHeight = Taro.getWindowInfo().windowHeight

    if (loading) {
      return <Loading />
    }

    return (
      <View className='listDetail-wrapper wrapper'>
        <ScrollView
          scrollY
          scrollTop={0}
          onScroll={this.scroll.bind(this)}
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
