import Action from '../utils/action'

export const updateState = (namespace: string, payload?: any) => Action(`${namespace}/updateState`, payload)

export const fetchSongInfo = ({ id, callback }) => Action('main/fetchSongInfo', { id, callback })

export const fetchSongById = ({ id, restore }) => Action('main/fetchSongById', { id, restore })

export const fetchLyric = ({ id }) => Action('main/fetchLyric', { id })

export const setShuffleList = ({ item }) => Action('main/getShuffleList', { item })

export const fetchAlbumList = ({ callback, initOffset, isInit }) => Action('album/fetchAlbumList', { callback, initOffset, isInit })

export const fetchNewestList = ({ callback }) => Action('newSong/fetchNewestList', { callback })

export const fetchRecommendList = ({ callback }) => Action('recommend/fetchRecommendList', { callback })

