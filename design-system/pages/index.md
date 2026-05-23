# 页面覆盖 · 首页 Index

> 继承 `MASTER.md`，以下仅写差异。

## 结构

- `.play-wrapper`：去掉过重 `box-shadow`（小程序全屏不需要窗口阴影），改 `background: $jm-color-bg`
- `.home-tab`：应用 **Section Tab** 规范（指示条动画 `transform: scaleX`，`$jm-duration-normal`）
- `.home-tab-wrapper`：保持 `flex: 1; min-height: 0`

## 交互

- Tab 切换：指示条 `transition: transform 250ms ease-out`（三档 translateX）
- 禁止 `:hover` 变色，改为选中态 class `.cur` only

## 内容区

- 各 Tab 面板统一 `background: transparent`，由子页面自带 surface
