import modelExtend from 'dva-model-extend'
import { model } from '../utils/model'
import Action from '../utils/action'
import { getRecommendList as fetchRecommendList } from '../services/index'
import { setCacheData } from '../utils'

export default modelExtend(model, {
  namespace: 'recommend',
  state: {
    recommendList: []
  },
  effects: {
    *fetchRecommendList({payload}, {put, call}) {
      const { callback } = payload
      try {
        const res = yield call(fetchRecommendList)
         // 缓存数据
        setCacheData('recommendList', res.result)
        yield put(Action('updateState', {recommendList: res.result || []}))
        callback && callback()
      } catch(e) {
        callback && callback()
        console.error(e)
      }
    }
  }
})
