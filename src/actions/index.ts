import Action from '../utils/action'

export const updateState = (namespace: string, payload?: any) => Action(`${namespace}/updateState`, payload)

export const fetchSongInfo = (payload?: any) => Action('main/fetchSongInfo', payload)

export const fetchSongById = (payload?: any) => Action('main/fetchSongById', payload)

export const fetchLyric = (payload?: any) => Action('main/fetchLyric', payload)

export const setShuffleList = (payload?: any) => Action('main/getShuffleList', payload)

export const fetchAlbumList = (payload?: any) => Action('album/fetchAlbumList', payload)

export const fetchNewestList = (payload?: any) => Action('newSong/fetchNewestList', payload)

export const fetchRecommendList = (payload?: any) => Action('recommend/fetchRecommendList', payload)

