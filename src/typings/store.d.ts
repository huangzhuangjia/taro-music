declare namespace StoreState {
  interface Lyric {
    lrc?: string;
    time?: number;
    endtime?: number;
  }
  export interface MainState {
    // 是否进入播放页面
    UIPage: boolean;
    // 歌曲信息
    songInfo: any;
    // 播放顺序
    playOrder: number;
    // 播放列表
    playList: Array<playItemState>;
    // 随机播放列表
    shuffleList: Array<playItemState>;
     // 播放状态
    playState: false;
    // 当前歌曲
    currentSong: any;
    // 当前歌词
    currentLyric: Array<Lyric>;
  }
  export interface RecommendState {
    recommendList: any
  }
  export interface AlbumState {
    albumList: any[];
    offset: number;
    limit: number;
    total: number;
  }
  export interface NewSongState {
    newestList: any
  }
  export interface playItemState {
    id?: number;
    name?: string;
    ar?: string;
    cover?: string;
    from?: string;
  }
}
