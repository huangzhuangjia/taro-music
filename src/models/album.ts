import modelExtend from 'dva-model-extend'
import { model } from '../utils/model'
import Action from '../utils/action'
import { setCacheData } from '../utils'
import { getAlbumList as fetchAlbumList } from '../services/index'

export default modelExtend(model,  {
  namespace: 'album',
  state: {
    albumList: [],
    offset: 0,
    limit: 30,
    total: 0
  },
  reducers: {
    loadFail(state) {
      return {
        ...state,
        offset: state.offset > 0 ? state.offset - 1 : state.offset
      }
    }
  },
  effects: {
    *fetchAlbumList({ payload }, { select, call, put }) {
      const { albumList, offset, limit } =  yield select(state => state.album),
            { callback, initOffset, isInit } = payload
      try {
        const res = yield call(fetchAlbumList, { offset: initOffset || offset, limit })
        let filterList = res.albums.map((item) => {
          return {
            id: item.id,
            name: item.name,
            picUrl: item.picUrl,
            singer: item.artist.name
          }
        })
        let list = isInit ? [] : albumList
        list = list.concat(filterList || [])
        // 缓存数据
        setCacheData('albumList', list)
        yield put(Action('updateState', { albumList: list, total: res.total }))
        callback && callback()
      } catch(e) {
        console.error(e)
        callback && callback()
        if (offset > 0) {
          yield put(Action('loadFail'))
        }
      }
    }
  }
})
