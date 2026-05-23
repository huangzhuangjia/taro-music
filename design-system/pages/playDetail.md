# 页面覆盖 · 播放层 PlayDetail

## 层级

- `.play-ui-page`：`z-index: $jm-z-player`
- 展开动画：`top: 100% → 0`，`$jm-duration-normal` `$jm-ease-out`

## 视觉

- `.player-panel`：炭灰渐变（MASTER 2.1），去掉纯 `#858585`
- `.song-name` / `.singer` / `.time`：`$jm-color-text-inverse`
- 进度条（Slider）：轨道 `$jm-color-progress-track`，已播 `$jm-color-progress-fill`

## 歌词

- `.lyric-item.select`：字号 `30rpx`，色 `$jm-color-text`
- `.lyric-item.ready`：字号 `26rpx`，opacity `0.55`

## 封面

- 播放中旋转：`animation: jm-spin 18s linear infinite`
- 暂停：动画暂停 `animation-play-state: paused`
