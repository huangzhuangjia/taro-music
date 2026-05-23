import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Slider } from '@tarojs/components'
import { connect } from 'react-redux'
import eventEmitter from '../../utils/eventEmitter'
import * as Events from '../../constants/event-types'
import { getGlobalData } from '../../utils/index'
import { updateState } from '../../actions'

import coverImg from '../../assets/image/logo.png'
import './playDetail.scss'

const playOrderIcon = ['icon-list-loop', 'icon-single-loop', 'icon-bofangye-caozuolan-suijibofang']

interface PlayDetailProps {
  main: StoreState.MainState
  onUpdateState: (namespace: string, payload: any) => any
}
interface PlayDetailStates {
  percent: number
  duration: number
  currentTime: number
}

const mapStateToProps = ({ main }) => ({ main })
const mapDispatchToProps = { onUpdateState: updateState }

class PlayDetail extends Component<PlayDetailProps, PlayDetailStates> {
  static options = { addGlobalClass: true }
  private audio: Taro.BackgroundAudioManager = getGlobalData('backgroundAudioManager')

  constructor() {
    super(...arguments)
    this.state = { percent: 0, duration: 0, currentTime: 0 }
  }

  componentDidMount() {
    this.audio.onTimeUpdate(() => this.getAudioPlayPercent())
  }

  componentWillReceiveProps(nextProps) {
    const { main } = nextProps
    if (!main.playState && main.UIPage) this.getAudioPlayPercent()
  }

  goBack() { this.props.onUpdateState('main', { UIPage: false }) }

  getAudioPlayPercent() {
    if (this.audio && this.audio.src) {
      const duration = this.audio.duration
      const currentTime = this.audio.currentTime
      this.setState({ duration, currentTime, percent: Number(((currentTime / duration) * 100).toFixed(6)) })
    }
  }

  formatSeconds(value: number): string {
    let theTime = value || 0, theTime1 = 0, theTime2 = 0
    if (theTime >= 60) {
      theTime1 = parseInt((theTime / 60).toString())
      theTime = parseInt((theTime % 60).toString())
      if (theTime1 >= 60) {
        theTime2 = parseInt((theTime1 / 60).toString())
        theTime1 = parseInt((theTime1 % 60).toString())
      }
    }
    let result = parseInt(theTime.toString()) > 9 ? '' + parseInt(theTime.toString()) : '0' + parseInt(theTime.toString())
    if (theTime1 > 0) {
      result = parseInt(theTime1.toString()) > 9 ? parseInt(theTime1.toString()) + ':' + result : '0' + parseInt(theTime1.toString()) + ':' + result
    } else { result = '00:' + result }
    if (theTime2 > 0) result = parseInt(theTime2.toString()) + ':' + result
    return result
  }

  onChangePercent(e) {
    const percent = e.detail.value
    const currentTime = (percent / 100) * this.state.duration
    this.setState({ percent, currentTime })
    this.audio.seek(currentTime)
  }

  onChangingPercent(e) {
    const percent = e.detail.value
    this.setState({ percent })
    if (!this.props.main.playState) {
      this.setState({ currentTime: (percent / 100) * this.state.duration })
    }
  }

  switchPlay(state: boolean) {
    const audioSrc = this.audio.src
    if (this.audio && audioSrc && audioSrc.indexOf('/null') === -1) {
      state ? this.audio.play() : this.audio.pause()
      this.props.onUpdateState('main', { playState: state })
    }
  }

  switchOrder() { eventEmitter.trigger(Events.SWITCHORDER) }
  playNext(type: number) { eventEmitter.trigger(Events.NEXT, type) }
  targetingCur() { eventEmitter.trigger(Events.SWITCHPLAYLIST) }

  render() {
    const { currentTime, duration, percent } = this.state
    const { main } = this.props
    const songInfo = main.songInfo
    const currentLyric = main.currentLyric
    const coverUrl = songInfo.al?.picUrl || coverImg
    if (!songInfo.hasOwnProperty('al')) songInfo.al = {}
    if (!songInfo.hasOwnProperty('ar')) songInfo.ar = [{}]
    const isPlaying = main.playState

    return (
      <View className='page-ui-wrapper'>
        <View className={`play-ui-page ${main.UIPage ? 'play-ui-page-show' : ''}`}>
          <Image className='play-ui-page__bg' src={coverUrl} mode='aspectFill' />
          <View className='play-nav'>
            <View className='play-nav__down iconfont icon-guanbi' onClick={this.goBack.bind(this)} />
          </View>
          <View className='play-body'>
            <View className='play-artwork'>
              <Image className='play-artwork__cover' src={coverUrl} mode='aspectFill' />
            </View>
            <View className='play-meta'>
              <Text className='play-meta__title'>{songInfo.name || ''}</Text>
              <Text className='play-meta__artist'>{songInfo.ar[0].name || ''}</Text>
            </View>
            <View className='play-progress'>
              <Slider className='play-progress__slider' value={percent} blockSize={12}
                activeColor='#FA2D48' backgroundColor='rgba(60,60,67,0.18)' blockColor='#FFFFFF'
                onChanging={this.onChangingPercent.bind(this)} onChange={this.onChangePercent.bind(this)} />
              <View className='play-progress__time'>
                <Text>{this.formatSeconds(currentTime)}</Text>
                <Text>{this.formatSeconds(duration)}</Text>
              </View>
            </View>
            <View className='play-controls'>
              <View className={`play-controls__btn iconfont ${playOrderIcon[main.playOrder]}`} onClick={this.switchOrder.bind(this)} />
              <View className='play-controls__btn play-controls__btn--skip iconfont icon-xiayishou1-copy' onClick={this.playNext.bind(this, -1)} />
              <View className={`play-controls__btn play-controls__btn--play iconfont ${isPlaying ? 'icon-weibiaoti519' : 'icon-bofang2'}`} onClick={this.switchPlay.bind(this, !isPlaying)} />
              <View className='play-controls__btn play-controls__btn--skip iconfont icon-xiayishou1' onClick={this.playNext.bind(this, 1)} />
              <View className='play-controls__btn iconfont icon-liebiao' onClick={this.targetingCur.bind(this)} />
            </View>
            <View className='lyric-box'>
              {currentLyric.map((item, i) => (
                <View key={i} className={`lyric-item ${item.time <= currentTime && item.endtime > currentTime ? 'lyric-item--active' : ''} ${item.time < currentTime + 3 && item.endtime > currentTime - 2 ? 'lyric-item--near' : ''}`}>
                  <Text>{item.lrc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayDetail)
