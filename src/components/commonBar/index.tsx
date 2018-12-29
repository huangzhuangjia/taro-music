import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import shuffleArray from 'shuffle-array'
import ControlBar from '../controlBar/controlBar'
import PlayList from '../playList/playList'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
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
  initAudio(restore: boolean) {
    let currentSong = this.props.main.currentSong
    let url: string = currentSong.url
    if (!url) {
      this.showMsgToast('获取资源失败')
      return
    }
    this.getSongInfo(currentSong.id, () => {
      this.audio.src = url
      if (!restore) {
        this.audio.seek(0)
        this.audio.play()
        this.props.onUpdateState('main', { playState: !this.audio.paused })
      }
    })
    this.getLyric(currentSong.id)
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
    let playOrder = main.playOrder;
    if (playOrder === 0) {
      playOrder = 1;
    } else if (playOrder === 1) {
      playOrder = 2;
    } else if (playOrder === 2) {
      playOrder = 0;
    }
    let tipItem = ['列表循环', '单曲循环', '随机播放']
    onUpdateState('main', {playOrder})
    // 缓存数据
    setCacheData('playOrder', playOrder)
    this.showMsgToast(tipItem[playOrder])
    let shuffleList = main.shuffleList;
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
    Taro.showToast({
      title: title,
      icon: 'none',
      duration: dur || 2000
    })
  }
  initAudioManager() {
    // 音乐停止
    this.audio.onEnded(() => {
      this.playNext(1)
    })
    // 用户在系统音乐播放面板点击上一曲事件（iOS only）
    this.audio.onPrev(() => {
      this.playNext(-1)
    })
    // 用户在系统音乐播放面板点击下一曲事件（iOS only）
    this.audio.onNext(() => {
      this.playNext(1)
    })
    // 背景音频播放事件
    this.audio.onPlay(() => {
      !this.props.main.playState && this.switchPlay(true)
    })
    // 背景音频暂停事件
    this.audio.onPause(() => {
      this.props.main.playState && this.switchPlay(false)
    })
  }
  initEvents() {
    // 监听初始化音频事件
    eventEmitter.off(Events.INITAUDIO)
    eventEmitter.on(Events.INITAUDIO, (restore) => {
      this.initAudio(restore)
    })
    // 监听处罚添加播放列表事件
    eventEmitter.off(Events.BATCHADD)
    eventEmitter.on(Events.BATCHADD, (item) => {
      this.batchAddToPlayList(item)
    })
    // 监听切换歌曲事件
    eventEmitter.off(Events.NEXT)
    eventEmitter.on(Events.NEXT, (type) => {
      this.playNext(type)
    })
    // 监听创建随机播放列表事件
    eventEmitter.off(Events.CREATESHUFFLE)
    eventEmitter.on(Events.CREATESHUFFLE, () => {
      this.createShuffleList()
    })
    // 监听切换播放事件
    eventEmitter.off(Events.SWITCHPLAY)
    eventEmitter.on(Events.SWITCHPLAY, (state) => {
      this.switchPlay(state)
    })
    // 歌曲播放类型切换
    eventEmitter.off(Events.SWITCHORDER)
    eventEmitter.on(Events.SWITCHORDER, () => {
      this.switchOrder()
    })
    // 监听点击展开播放列表事件
    eventEmitter.off(Events.SWITCHPLAYLIST)
    eventEmitter.on(Events.SWITCHPLAYLIST, () => {
      this.targetingCur()
    })
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
  componentDidMount() {
    this.query = Taro.createSelectorQuery()
    this.initAudioManager()
    this.initEvents()
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
        <ControlBar isUIPage={main.UIPage}
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
