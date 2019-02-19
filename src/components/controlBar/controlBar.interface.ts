export interface ControlBarProps {
  isUIPage: boolean;
  playState: boolean;
  songInfo: any;
  transform: string;
  onToUIPage: () => any
  onSwitchPlay: (state: boolean) => any
  onTargetingCur: () => any
  ref?: string
}