import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import shuffleArray from 'shuffle-array'
import ControlBar from '../controlBar/controlBar'
import PlayList from '../playList/playList'
import { bindPlayerEventsOnce, setPlayerHost } from '../../utils/playerBridge'
import { getGlobalData, setCacheData, getCacheData } from '../../utils/index'
import {
  fetchSongInfo,
  fetchSongById,
  fetchLyric,
  setShuffleList,
  updateState
} from '../../actions'

interface CommonBarProps {
  main: StoreState.MainState;
  onFetchSongInfo: (payload: { id: number, callback?: any }) => any;
  onFetchSongById: (payload: { id: number, restore?: boolean }) => any;
  onFetchLyric: (payload: { id: number }) => any;
  onSetShuffleList: (payload: { item: Array<StoreState.playItemState> }) => any;
  onUpdateState: (namespace: string, payload: any) => any;
}
interface CommonBarStates {
  playListState: boolean;
  playList: Array<StoreState.playItemState>;
  transform: string;
}

const mapStateToProps = ({ main }) => ({
  main
})
const mapDispatchToProps = ({
  onFetchSongInfo: fetchSongInfo,
  onFetchSongById: fetchSongById,
  onFetchLyric: fetchLyric,
  onSetShuffleList: setShuffleList,
  onUpdateState: updateState
})

@connect(mapStateToProps, mapDispatchToProps)
class CommonBar extends Component<CommonBarProps, CommonBarStates> {
  static options = {
    addGlobalClass: true
  }
  private audio: Taro.BackgroundAudioManager = getGlobalData('backgroundAudioManager')
  private pendingPlaySongId: number | undefined
  constructor() {
    super(...arguments)
    this.state = {
      playListState: false,
      playList: [],
      transform: 'animation: imgRotate 12s linear infinite;'
    }
  }
  navigateTo(url: string) {
    Taro.navigateTo({ url: url })
  }
  toUIPage() {
    this.props.onUpdateState('main', { UIPage: true })
  }
  // 初始化播放器
  initAudio(payload: boolean | StoreState.InitAudioPayload) {
    const restore = typeof payload === 'boolean' ? payload : !!payload?.restore
    const currentSong =
      typeof payload === 'object' && payload?.currentSong
        ? payload.currentSong
        : this.props.main.currentSong
    const songId = currentSong?.id
    const url: string = currentSong?.url

    if (!songId || !url) {
      this.showMsgToast('获取资源失败')
      return
    }

    this.pendingPlaySongId = songId

    this.getSongInfo(songId, () => {
      if (this.pendingPlaySongId !== songId) return
      this.audio.src = url
      if (!restore) {
        this.audio.seek(0)
        this.audio.play()
        this.props.onUpdateState('main', { playState: !this.audio.paused })
      }
    })
    this.getLyric(songId)
  }
  // 歌曲播放
  playSongById(id: number | undefined, restore?: boolean) {
    if (!id) return
    this.props.onFetchSongById({id, restore})
  }
  // 获取歌曲信息
  getSongInfo(id: number, callback?: any) {
    this.props.onFetchSongInfo({id, callback})
  }
  // 获取歌词
  getLyric(id) {
    this.props.onFetchLyric({id})
  }
  // 随机插入播放列表
  insertToShuffleList(item: Array<StoreState.playItemState>) {
    this.props.onSetShuffleList({item})
  }
  // 保存当前列表信息在本地
  savePlayList(playList: Array<StoreState.playItemState>) {
    this.setState({
      playList: playList
    })
    setCacheData('playList', playList)
  }
  //播放切换
  switchPlay(state: boolean) {
    let { onUpdateState } = this.props
    if (this.audio && this.audio.src && this.audio.src.indexOf('/null') == -1) {
      state ? this.audio.play() : this.audio.pause()
      onUpdateState('main', { playState: state })
    }
  }
  // 添加播放列表
  batchAddToPlayList(item: Array<StoreState.playItemState>) {
    let { onUpdateState, main } = this.props,
      { playList, shuffleList } = main
    let addItem: Array<StoreState.playItemState> = [],
        ids: Array<number | undefined> = playList.map(i => i.id)
    item.forEach((data: StoreState.playItemState) => {
      if (!ids.includes(data.id)) {
        addItem.push(data)
      }
    })
    playList = addItem.concat(playList)
    onUpdateState('main', { playList })
    this.savePlayList(playList)
    this.showMsgToast('添加成功!')
    if (shuffleList.length > 0) {
      this.insertToShuffleList(addItem)
    } else {
      this.createShuffleList()
    }
  }
  // 继续当前播放歌曲
  restore(id: number) {
    let playList: Array<StoreState.playItemState> = this.props.main.playList
    let curSong: StoreState.playItemState = {}
    playList.map((data) => {
      if(data.id === id) {
        curSong = data
      }
    })
    this.playSongById(curSong.id, true)
    let currentTime: number = getCacheData('currentTime') || 0
    if(currentTime > 0) {
      this.audio.seek(currentTime)
    }
  }
  // 切换下一首歌曲
  playNext(type: number, key?: any) {
    let { main } = this.props
    let playOrder = main.playOrder,
      playList = main.playList,
      shuffleList = main.shuffleList,
      currentSong = main.currentSong,
      nextIndex = 0,
      curIndex = 0,
      nextSong
    if (playList.length === 0) {
      this.resetPlayer()
      return
    }
    if (key !== undefined) {
      curIndex = key - 1
    } else {
      if (playOrder < 2) {
        playList.map((data, k) => {
          if (data.id === currentSong.id) {
            curIndex = k
          }
        })
      } else {
        shuffleList.map((data, k) => {
          if (data.id === currentSong.id) {
            curIndex = k
          }
        })
      }
    }
    if (playOrder === 0 || playOrder === 2) {
      nextIndex = curIndex + type
      if (nextIndex < 0) {
        nextIndex = playList.length - 1
      } else if (nextIndex === playList.length) {
        nextIndex = 0
      }
    } else if (playOrder === 1) {
      nextIndex = curIndex
    }
    if (playOrder < 2) {
      nextSong = playList[nextIndex]
    } else {
      nextSong = shuffleList[nextIndex]
    }
    this.playSongById(nextSong.id)
  }
  // 重置
  resetPlayer() {
    const { onUpdateState } = this.props
    onUpdateState('main', {
      currentSong: {},
      songInfo: {},
      playState: false
    })
    this.audio.src = 'null'
  }
  // 点击显示当前播放列表
  targetingCur() {
    let curPlayRow = this.query.select('.wrapper >>> .common-bar-wrapper >>> .row-playing')
    this.setState({
      playListState: true,
    })
    if (curPlayRow.length > 0) {
      curPlayRow = curPlayRow[0];
      curPlayRow.boundingClientRect(rect => {
        let top = rect.top - 40 * 5
        if (top < 0) {
          top = 0
        }
        this.refs.playList.refs.songListItem.scrollTop = top
      }).exec()
    }
  }
  // 关闭播放列表
  onClose() {
    this.setState({
      playListState: false
    })
  }
  // 切换播放列表的播放顺序
  switchOrder() {
    const { main, onUpdateState } = this.props
    const tipItem = ['列表循环', '单曲循环', '随机播放']
    const cached = getCacheData('playOrder')
    const current =
      typeof cached === 'number' && cached >= 0 && cached <= 2
        ? cached
        : main.playOrder
    const playOrder = (current + 1) % 3

    onUpdateState('main', { playOrder })
    setCacheData('playOrder', playOrder)

    Taro.hideToast()
    this.showMsgToast(tipItem[playOrder], 1500)

    const shuffleList = main.shuffleList
    if (shuffleList && shuffleList.length === 0) {
      this.createShuffleList()
    }
  }
   // 创建随机播放列表
  createShuffleList() {
    const { onUpdateState } = this.props
    let playList = getCacheData('playList')
    let shuffleList = shuffleArray(playList || [], { copy: true })
    onUpdateState('main', { shuffleList })
  }
  listToPlay(id: number) {
    this.playSongById(id)
  }
  // 删除播放列表
  delList(id: number | string, key?: number) {
    const { main, onUpdateState } = this.props
    let playList = main.playList || [];
    if (id === 'all') {
      playList = []
    } else {
      if (key !== undefined && playList[key].id === id) {
        playList.splice(key, 1)
      }
    }
    onUpdateState('main', { playList })
    this.savePlayList(playList)
    if (main.currentSong.id === id) {
      this.playNext(1, key)
    }
  }
  showMsgToast(title: string, dur?: number) {
    Taro.hideToast()
    Taro.showToast({
      title,
      icon: 'none',
      duration: dur || 1500
    })
  }
  initAudioManager() {
    if (getGlobalData('audioManagerBound')) return
    setGlobalData('audioManagerBound', true)

    const getHost = (): CommonBar | undefined => getGlobalData('playerHostRef')

    this.audio.onEnded(() => {
      getHost()?.playNext(1)
    })
    this.audio.onPrev(() => {
      getHost()?.playNext(-1)
    })
    this.audio.onNext(() => {
      getHost()?.playNext(1)
    })
    this.audio.onPlay(() => {
      const host = getHost()
      host && !host.props.main.playState && host.switchPlay(true)
    })
    this.audio.onPause(() => {
      const host = getHost()
      host && host.props.main.playState && host.switchPlay(false)
    })
  }
  registerAsPlayerHost() {
    setPlayerHost(this)
    setGlobalData('playerHostRef', this)
  }
  componentWillMount() {
    let playOrder = getCacheData('playOrder') || 0,
      playList = getCacheData('playList') || [],
      { onUpdateState } = this.props
    onUpdateState('main', {
      playOrder,
      playList
    })
    this.savePlayList(playList)
    if (playOrder === 2) {
      this.createShuffleList();
    }
  }
  pageLifetimes = {
    show: () => {
      this.registerAsPlayerHost()
    }
  }

  componentWillUnmount() {
    if (getGlobalData('playerHostRef') === this) {
      setGlobalData('playerHostRef', null)
      setPlayerHost(null)
    }
  }

  componentDidMount() {
    this.query = Taro.createSelectorQuery()
    bindPlayerEventsOnce()
    this.registerAsPlayerHost()
    this.initAudioManager()
    // let currentSongId = getCacheData('currentSongId')
    // if(currentSongId) {
    //   this.restore(currentSongId)
    // }
  }
  render() {
    let { main } = this.props
    let { playListState, playList, transform } = this.state
    if (!main) return
    let songInfo = main.songInfo

    if (!songInfo.hasOwnProperty('al')) {
      songInfo.al = {};
    }
    if (!songInfo.hasOwnProperty('ar')) {
      songInfo.ar = [{}];
    }
    const hasActiveSong = !!(main.currentSong && main.currentSong.id)
    return (
      <View className='common-bar-wrapper'>
         {/*播放列表*/}
         <PlayList playList={playList}
                  playListState={playListState}
                  playOrder={main.playOrder}
                  currentSong={main.currentSong}
                  onClose={this.onClose.bind(this)}
                  onSwitchOrder={this.switchOrder.bind(this)}
                  onDelList={this.delList.bind(this)}
                  onListToPlay={this.listToPlay.bind(this)}
                  ref='playList'/>
        {/*控制条*/}
        <ControlBar visible={hasActiveSong}
                    isUIPage={main.UIPage}
                    playState={main.playState}
                    songInfo={songInfo}
                    transform={transform}
                    onToUIPage={this.toUIPage.bind(this)}
                    onSwitchPlay={this.switchPlay.bind(this)}
                    onTargetingCur={this.targetingCur.bind(this)}
                    ref='ControlBar'/>
     </View>
    )
  }
}

export default CommonBar
