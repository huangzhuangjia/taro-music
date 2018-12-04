import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import shuffleArray from 'shuffle-array'
import ControlBar from '../controlBar/controlBar'
import PlayList from '../playList/playList'
import Action from '../../utils/action'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
import { getGlobalData, setCacheData, getCacheData } from '../../utils'

@connect(({ main, loading }) => ({
  main,
  loading
}))
class Index extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
    this.state = {
      playListState: false,
      playList: [],
      transform: 'animation: imgRotate 12s linear infinite;'
    }
    this.audio = null
  }
  navigateTo(url) {
    Taro.navigateTo({url: url})
  }
  toUIPage() {
    this.props.dispatch(Action('main/updateState', {UIPage: true}))
  }
  // 初始化播放器
  initAudio(restore) {
    let currentSong = this.props.main.currentSong
    let url = currentSong.url
    if (!url) {
      this.showMsgToast('获取资源失败')
      return
    }
    this.getSongInfo(currentSong.id)
    this.getLyric(currentSong.id)
    // this.audio.crossOrigin = 'anonymous'
    this.audio.src = url
    if (!restore) {
      this.audio.seek(0)
      this.audio.play()
      this.props.dispatch(Action('main/updateState', {playState: !this.audio.paused}))
    }
  }
  // 歌曲播放
  playSongById(id, restore) {
    const { dispatch } = this.props
    dispatch(Action('main/fetchSongById', {id, restore}))
  }
  // 获取歌曲信息
  getSongInfo(id) {
    const { dispatch } = this.props
    dispatch(Action('main/fetchSongInfo', {id}))
  }
  // 获取歌词
  getLyric(id) {
    const { dispatch } = this.props
    dispatch(Action('main/fetchLyric', {id}))
  }
  // 随机插入播放列表
  insertToShuffleList(item) {
    this.props.dispatch(Action('main/getShuffleList', {item}))
  }
  // 保存当前列表信息在本地
  savePlayList(playList) {
    this.setState({
      playList: playList
    })
    setCacheData('playList', playList)
  }
  //播放切换
  switchPlay(state) {
    let { dispatch } = this.props
    if (this.audio && this.audio.src && this.audio.src.indexOf('/null') == -1) {
      state ? this.audio.play() : this.audio.pause()
      dispatch(Action('main/updateState', {playState: state}))
    }
  }
  // 添加播放列表
  batchAddToPlayList(item) {
    let { dispatch, playList, shuffleList } = this.props
    let addItem = [],
        ids = playList.map(i => i.id)
    item.forEach((data) => {
      if (!ids.includes(data.id)) {
        addItem.push(data)
      }
    })
    playList = addItem.concat(playList)
    dispatch(Action('main/updateState', {playList}))
    this.savePlayList(playList)
    this.showMsgToast('添加成功!')
    if (shuffleList && shuffleList.length > 0) {
      this.insertToShuffleList(addItem)
    } else {
      this.createShuffleList()
    }
  }
  // 继续当前播放歌曲
  restore(id) {
    let playList = this.props.main.playList
    let curSong = {}
    playList.map((data) => {
      if(data.id === id) {
        curSong = data
      }
    })
    this.playSongById(curSong.id, true)
    let currentTime = getCacheData('currentTime') || 0
    if(currentTime > 0) {
      this.audio.seek(currentTime)
      this.timeupdate()
    }
  }
  // 播放时间更新进度加载
  timeupdate() {
    // let currentTime = this.audio.currentTime
    // let audioDuration = this.audio.duration
    // let playPercent = currentTime / audioDuration * 100
    // this.progress('.wrapper >>> .common-bar-wrapper >>> #progress', playPercent)
    // eventEmitter.trigger(Events.PLAYPERCENT)
  }
  // 切换下一首歌曲
  playNext(type, key) {
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
    const { dispatch } = this.props
    dispatch(Action('main/updateState', {
      currentSong: {},
      songInfo: {},
      playState: false
    }))
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
    const { main, dispatch } = this.props
    let playOrder = main.playOrder;
    if (playOrder === 0) {
      playOrder = 1;
    } else if (playOrder === 1) {
      playOrder = 2;
    } else if (playOrder === 2) {
      playOrder = 0;
    }
    let tipItem = ['列表循环', '单曲循环', '随机播放']
    dispatch(Action('main/updateState', {playOrder}))
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
    const { dispatch } = this.props
    let playList = getCacheData('playList')
    let shuffleList = shuffleArray(playList || [], { copy: true })
    dispatch(Action('main/updateState', {shuffleList}))
  }
  listToPlay(data) {
    this.playSongById(data.id)
  }
  // 删除播放列表
  delList(id, key) {
    const { main, dispatch } = this.props
    let playList = main.playList || [];
    if (id === 'all') {
      playList = []
    } else {
      if (playList[key].id === id) {
        playList.splice(key, 1)
      }
    }
    dispatch(Action('main/updateState', {playList}))
    this.savePlayList(playList)
    if (main.currentSong.id === id) {
      this.playNext(1, key)
    }
  }
  showMsgToast(title, dur) {
    Taro.showToast({
      title: title,
      icon: 'none',
      duration: dur || 2000
    })
  }
  // 绘制圆形进度条方法
  run(c, w, h) {
    let num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI
    this.canvas.setStrokeStyle("#666")
    this.canvas.setLineWidth("2")
    this.canvas.setLineCap("round")
    this.canvas.beginPath()
    this.canvas.arc(w, h, w-0.8, -0.5 * Math.PI, num) //每个间隔绘制的弧度
    this.canvas.stroke()
    this.canvas.draw()
  }
  // 环形进度条进度显示
  progress(id, percent) {
    // 获取ControlBar组件 Canvas
    this.canvas = Taro.createCanvasContext('progress', this.refs.ControlBar.$scope)
    this.query.select(id).boundingClientRect(rect => { //监听canvas的宽高
      let w = parseInt(rect.width / 2) //获取canvas宽的的一半
      let h = parseInt(rect.height / 2) //获取canvas高的一半，
      this.run(percent, w, h)
    }).exec()
  }
  initAudioManager() {
    // 获取全局创建的一个系统背景音频管理对象，防止重复播放
    this.audio = getGlobalData('backgroundAudioManager')
    // 背景音频播放进度更新事件
    // this.audio.onTimeUpdate(() => {
    //   this.timeupdate()
    // })
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
      { dispatch } = this.props
    dispatch(Action('main/updateState', {
      playOrder,
      playList
    }))
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

export default Index
