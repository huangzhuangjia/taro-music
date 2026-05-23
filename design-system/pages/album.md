# 页面覆盖 · 新碟上架 Album

## 网格

- 废弃 `float: left` + `clearfix`
- 使用：

```scss
.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: $jm-space-md;
  padding: $jm-space-sm $jm-page-x $jm-list-bottom;
}
.album-itembox {
  width: calc((100% - #{$jm-space-md}) / 2);
  flex-shrink: 0;
}
```

## 黑胶装饰

- `.cover::before`：`opacity: 0.12`，`background: $jm-color-player-from`，`right: -20rpx`
- 封面图：`border-radius: $jm-radius-sm`

## 文案

- `.name`：`$jm-font-title`
- `.singer`：`$jm-font-caption`
