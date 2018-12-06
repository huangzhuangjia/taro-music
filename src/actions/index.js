import Action from '../utils/action'

export const updateState = (namespace, payload) => Action(`${namespace}/updateState`, payload)

export const fetchSongInfo = (payload) => Action('main/fetchSongInfo', payload)

export const fetchSongById = (payload) => Action('main/fetchSongById', payload)

export const fetchLyric = (payload) => Action('main/fetchLyric', payload)

export const setShuffleList = (payload) => Action('main/getShuffleList', payload)

export const fetchAlbumList = (payload) => Action('album/fetchAlbumList', payload)

export const fetchNewestList = (payload) => Action('newSong/fetchNewestList', payload)

export const fetchRecommendList = (payload) => Action('recommend/fetchRecommendList', payload)

