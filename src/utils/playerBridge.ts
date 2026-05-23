import eventEmitter from './eventEmitter'
import * as Events from '../constants/event-types'

export interface PlayerHost {
  initAudio(payload: any): void
  batchAddToPlayList(item: any): void
  playNext(type: number, key?: any): void
  createShuffleList(): void
  switchPlay(state: boolean): void
  switchOrder(): void
  targetingCur(): void
  readonly props?: { main: StoreState.MainState }
}

let activeHost: PlayerHost | null = null
let listenersBound = false

export function setPlayerHost(host: PlayerHost | null) {
  activeHost = host
}

export function bindPlayerEventsOnce() {
  if (listenersBound) return
  listenersBound = true

  eventEmitter.on(Events.INITAUDIO, (payload) => {
    activeHost?.initAudio(payload)
  })
  eventEmitter.on(Events.BATCHADD, (item) => {
    activeHost?.batchAddToPlayList(item)
  })
  eventEmitter.on(Events.NEXT, (type) => {
    activeHost?.playNext(type)
  })
  eventEmitter.on(Events.CREATESHUFFLE, () => {
    activeHost?.createShuffleList()
  })
  eventEmitter.on(Events.SWITCHPLAY, (state) => {
    activeHost?.switchPlay(state)
  })
  eventEmitter.on(Events.SWITCHORDER, () => {
    activeHost?.switchOrder()
  })
  eventEmitter.on(Events.SWITCHPLAYLIST, () => {
    activeHost?.targetingCur()
  })
}
