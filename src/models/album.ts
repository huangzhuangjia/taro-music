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
      const { albumList, offset, limit } = yield select(state => state.album)
      const { callback, initOffset, isInit } = payload
      const pageOffset = initOffset ?? offset

      try {
        const res = yield call(fetchAlbumList, { offset: pageOffset, limit })
        const source = res.albums || res.monthData || res.weekData || []
        const pageData = source.slice(pageOffset * limit, (pageOffset + 1) * limit)

        const filterList = pageData.map((item) => ({
          id: item.id,
          name: item.name,
          picUrl: item.picUrl,
          singer: item.artist?.name || item.artists?.[0]?.name || ''
        }))

        const list = isInit ? filterList : albumList.concat(filterList)
        const total = res.total ?? source.length

        setCacheData('albumList', list)
        yield put(Action('updateState', {
          albumList: list,
          total,
          offset: pageOffset
        }))
        callback && callback()
      } catch (e) {
        console.error(e)
        callback && callback()
        if (pageOffset > 0) {
          yield put(Action('loadFail'))
        }
      }
    }
  }
})
