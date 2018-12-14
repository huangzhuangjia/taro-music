import modelExtend from 'dva-model-extend'
import { model } from '../utils/model'
import Action from '../utils/action'
import { setCacheData, getGlobalData } from '../utils'
import {
  getSongInfo as fetchSongInfo,
  getMusicUrl as fetchMusicUrl,
  getLyric as fetchLyric
} from '../services/index'
import eventEmitter from '../utils/eventEmitter'
import * as Events from '../constants/event-types'

// 处理歌词
function formatLyric(lrc: string): Array<StoreState.Lyric> {
  if (!lrc) return []
  let format = /\[(\d{2}:\d{2})\.\d{2,3}\](.*)/
  let outLrc = {}
  let lrcList: Array<StoreState.Lyric> = []
  let lrcArr: Array<string> = lrc.split('\n') || []

  lrcArr.forEach(item => {
    let matchLrc = item.match(format)
    if (!matchLrc) return
    let lrcTime = matchLrc[1]
    let lrcText = matchLrc[2] || '(space)'
    outLrc[lrcTime] = lrcText
  })

  Object.keys(outLrc).forEach(i => {
    let ts = i.split(':')
    let time = parseInt(ts[0]) * 60 + parseInt(ts[1])

    if (lrcList.length) {
      lrcList[lrcList.length - 1].endtime = time
    }
    lrcList.push({
      time: time,
      lrc: outLrc[i]
    })
  })
  return lrcList
}
// 初始化背景音乐信息
function initBackgroundAudioInfo(songObj, callback) {
  let audio = getGlobalData('backgroundAudioManager')
  audio.title = songObj.name
  audio.singer = songObj.ar
  audio.coverImgUrl = songObj.cover
  callback && callback()
}

export default modelExtend(model,  {
  namespace: 'main',
  state: {
    // 是否进入播放页面
    UIPage: false,
    // 歌曲信息
    songInfo: {},
    // 播放顺序
    playOrder: 0,
    // 播放列表
    playList: [],
    // 随机播放列表
    shuffleList: [],
    // 播放状态
    playState: false,
    // 当前歌曲
    currentSong: {},
    // 当前歌词
    currentLyric: []
  },
  reducers: {
    getShuffleList(state, { payload }) {
      const { item } = payload
      if (!item) return
      let shuffleList = state.shuffleList,
          len = shuffleList.length
      ;(item || []).map((data) => {
        let insertPosition = Math.floor(len * Math.random())
        shuffleList = shuffleList.splice(insertPosition, 0, data)
      })
      return {
        ...state,
        shuffleList
      }
    }
  },
  effects: {
    *fetchSongById({ payload }, { select, call, put }) {
      try {
        const { id, restore } = payload
        const { currentSong, playState } = yield select(state => state.main)
        if (currentSong.id === id && playState) return
        const res = yield call(fetchMusicUrl, {id})
        if (res.data.length > 0) {
          yield put(Action('updateState', {currentSong: res.data[0]}))
          setCacheData('currentSongId', res.data[0].id)
          eventEmitter.trigger(Events.INITAUDIO, restore)
        }
      } catch(e) {
        console.error(e)
      }
    },
    *fetchSongInfo({ payload }, { select, call, put }) {
      try {
        const { main } = yield select(state => state)
        const { id, callback } = payload
        const res = yield call(fetchSongInfo, { ids: id })
        let songData: any = {}
        songData = res.songs[0]
        yield put(Action('updateState', { songInfo: songData }))
        if (songData.name && songData.ar[0].name) {
          let playList = main.playList || []
          let songObj: StoreState.playItemState = {
            id: id,
            name: songData.name || '',
            ar: songData.ar[0].name || '',
            cover: songData.al.picUrl,
            from: 'online',
          }
          initBackgroundAudioInfo(songObj, callback)
          if (!playList.map(i => i.id).includes(id)) {
            playList.unshift(songObj)
            yield put(Action('updateState', {playList}))
            setCacheData('playList', playList)
            if (main.shuffleList.length > 0) {
              yield put(Action('getShuffleList', {item: [songObj]}))
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    *fetchLyric({payload}, {call, put}) {
      try {
        const res = yield call(fetchLyric, payload)
        let lyric: string = res.lrc ? res.lrc.lyric : null
        let currentLyric = formatLyric(lyric)
        yield put(Action('updateState', {currentLyric}))
      } catch (e) {
        console.error(e)
      }
    }
  }
})
