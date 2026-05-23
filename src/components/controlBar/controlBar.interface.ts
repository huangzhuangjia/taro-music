export interface ControlBarProps {
  /** 是否有当前曲目（有则允许显示底栏） */
  visible: boolean
  isUIPage: boolean
  playState: boolean
  songInfo: any
  transform: string
  onToUIPage: () => any
  onSwitchPlay: (state: boolean) => any
  onTargetingCur: () => any
  ref?: string
}
