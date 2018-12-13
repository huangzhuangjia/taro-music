import modelExtend from 'dva-model-extend'
import { model } from '../utils/model'
import Action from '../utils/action'
import { setCacheData } from '../utils'
import { getNewSong as fetchNewSong } from '../services/index'

export default modelExtend(model, {
  namespace: 'newSong',
  state: {
    newestList: []
  },
  effects: {
    *fetchNewestList({ payload }, { put, call }) {
      try {
        const res = yield call(fetchNewSong)
        let newestList = res.result || []
        // 缓存数据
        setCacheData('newSongList', newestList)
        yield put(Action('updateState', { newestList }))
        payload.callback && payload.callback()
      } catch(e) {
        console.error(e)
      }
    }
  }
})
