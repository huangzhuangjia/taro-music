export interface playOrderItem {
  icon: string
  name: string
}

export interface PlayListProps {
  playList: Array<StoreState.playItemState>,
  playListState: boolean,
  playOrder: number,
  currentSong: any,
  onClose: () => any,
  onSwitchOrder: () => any,
  onDelList: (type: number | string, key?: number) => any,
  onListToPlay: (id: number) => any,
  ref?: string
}