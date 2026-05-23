# JMusic 设计系统 · 沉韵 Slate Resonance

> 产品：基于 Taro 4 的网易云 API 音乐小程序（品牌名 **JMusic**）  
> 平台：微信小程序优先（375rpx 设计基准）  
> 方法论：参考 [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2 Design System Generator  
> 版本：1.0.0 · 2026-05-23

---

## 1. 产品定位与推理

| 维度 | 结论 |
|------|------|
| **行业分类** | Music Streaming / Mini Program Player |
| **用户场景** | 浏览推荐歌单 → 听最新单曲 → 逛新碟 → 详情播放 → 后台音频 |
| **核心转化** | 点击播放、进入详情、持续收听（非电商转化） |
| **现有资产** | iconfont、`BackgroundAudioManager`、三 Tab 首页、黑胶装饰（album）、vinyl 旋转封面 |
| **差异化** | 不做网易红高仿；用 **暖石色 + 珊瑚强调 + 编辑型排版**，形成「私人听单助手」气质 |

### 推荐 UI 模式（Pattern）

**Tabbed Music Feed + Persistent Mini Player**

```
┌─────────────────────────────────────┐
│  Nav: JMusic                        │
├─────────────────────────────────────┤
│  [推荐歌单] [最新单曲] [新碟上架]    │  ← Section Tab + 指示条
├─────────────────────────────────────┤
│  Hero Banner（仅推荐 Tab）           │
│  ─────────────────────────────────  │
│  Scroll List / Album Grid           │
├─────────────────────────────────────┤
│  Mini Player Bar（safe-area）        │
└─────────────────────────────────────┘
         ↓ 上滑/点击
┌─────────────────────────────────────┐
│  Full Player（封面 + 歌词 + 控制）   │
└─────────────────────────────────────┘
```

### 风格关键词（Style）

**Soft UI Evolution × Editorial Music × Vinyl Accent**

- 柔和阴影、浅灰纸感背景、卡片式封面
- 列表偏杂志排版（左对齐、清晰层级）
- 新碟区保留轻微「唱片沟槽」装饰，但降对比、改暖色
- 播放器用 **炭灰渐变面板**，替代当前纯 `#858585` 平板

### 必须避免（Anti-patterns）

| 禁止 | 原因 |
|------|------|
| 网易官方红 `#C20C0C` 作为主色 | 品牌混淆、无辨识度 |
| AI 紫粉渐变、霓虹赛博 | 与「沉韵」气质冲突 |
| 大面积 Dark Mode OLED 黑 | 小程序日活场景以浅色阅读为主 |
| 纯 `hover` / `cursor` 作为主反馈 | 微信端无效 |
| `px` + `rpx` + `vw` 混排 | 机型不一致（现有痛点） |
| emoji 当图标 | 与 iconfont 体系冲突 |
| 播放中仅灰色底无品牌色 | 可发现性差 |

### 交付前检查清单（Pre-delivery）

- [ ] 可点击区域高度 ≥ `88rpx`
- [ ] 正文对比度 ≥ 4.5:1（`#2C2C2C` on `#F6F7F9`）
- [ ] 底部栏 `padding-bottom: env(safe-area-inset-bottom)`
- [ ] 图片 `lazy-load` + 占位色 `#E8EAED`
- [ ] 按压态用 `:active` / `.is-active`，非 `:hover`
- [ ] 主色仅用于：Tab 选中、播放中、主按钮、进度条
- [ ] 动画时长 200–300ms，`ease-out`

---

## 2. 设计令牌 Design Tokens

### 2.1 色彩 Color（v2 · UI UX Pro Max 分层）

| 角色 | 色值 | 说明 |
|------|------|------|
| 页面底 | `#E6E4DF` | 暖石灰，非纯白 |
| 内容面 | `#EFEDEA` | Tab 列表区 |
| 抬升面 | `#F7F5F2` | Tab 栏、底栏、卡片 |
| 主色 CTA | `#C85347` | 赤陶（非网易红） |
| 播放强调 | `#3A9B6E` | 可选播放态点缀 |
| 播放器 | `#45435A → #2A2838` | 靛灰炭渐变 |

```scss
$jm-color-bg: #E6E4DF;
$jm-color-surface: #EFEDEA;
$jm-color-surface-raised: #F7F5F2;
$jm-color-primary: #C85347;
```

### 2.2 字体 Typography

微信小程序以系统字体为主，不强依赖网络字体（保留 `Amble` 仅作数字/英文点缀可选）。

```scss
$jm-font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC',
  'Helvetica Neue', Helvetica, sans-serif;

// 字号阶梯（rpx，750 设计稿）
$jm-font-display:   40rpx;  // 歌单 Hero 标题
$jm-font-title:     32rpx;  // 列表主标题
$jm-font-body:      28rpx;  // 正文、Tab
$jm-font-caption:   24rpx;  // 歌手、播放量
$jm-font-micro:     22rpx;  // 时间、辅助
$jm-font-tab:       28rpx;

$jm-weight-regular: 400;
$jm-weight-medium:  500;
$jm-weight-bold:    600;

$jm-line-tight:     1.35;
$jm-line-normal:    1.5;
$jm-line-loose:     1.65;
```

### 2.3 间距 Spacing

```scss
$jm-space-2xs:  8rpx;
$jm-space-xs:   16rpx;
$jm-space-sm:   24rpx;
$jm-space-md:   32rpx;
$jm-space-lg:   48rpx;
$jm-space-xl:   64rpx;

$jm-page-x:     32rpx;   // 列表左右边距（统一替代 36px/45px 混用）
$jm-list-bottom: 160rpx; // 为 mini player 留白
```

### 2.4 圆角 · 阴影 · 层级

```scss
$jm-radius-sm:    8rpx;
$jm-radius-md:    12rpx;
$jm-radius-lg:    16rpx;
$jm-radius-round: 50%;

$jm-shadow-sm:    0 4rpx 16rpx rgba(44, 44, 44, 0.06);
$jm-shadow-md:    0 8rpx 28rpx rgba(44, 44, 44, 0.10);
$jm-shadow-cover: 0 12rpx 40rpx rgba(44, 44, 44, 0.14);

$jm-z-tab:        10;
$jm-z-bar:        100;
$jm-z-player:     1000;
$jm-z-toast:      9999;
```

### 2.5 动效 Motion

```scss
$jm-duration-fast:   150ms;
$jm-duration-normal: 250ms;
$jm-duration-slow:   400ms;
$jm-ease-out:        cubic-bezier(0.33, 1, 0.68, 1);

// 封面旋转（播放中）
// animation: jm-spin 20s linear infinite;
```

---

## 3. 组件规范 Components

命名前缀建议：`jm-`（新类）或渐进改造现有 class。

### 3.1 Section Tab（首页三 Tab）

| 状态 | 样式 |
|------|------|
| 默认 | 字色 `$jm-color-text-secondary`，字重 400 |
| 选中 | 字色 `$jm-color-text`，字重 600 |
| 指示器 | 宽 `48rpx`，高 `6rpx`，圆角 `3rpx`，底色 `$jm-color-primary`，居中于文字下 `8rpx` |
| 容器 | 高 `88rpx`，底边框 `1rpx solid $jm-color-divider`，背景 `$jm-color-surface` |

```
    推荐歌单        最新单曲        新碟上架
       ━━━
```

### 3.2 Hero Banner（推荐歌单首位）

- 布局：左封面 `38vw` 正方 + 右信息区，整体 `padding: $jm-space-md $jm-page-x`
- 封面：`border-radius: $jm-radius-md`，`box-shadow: $jm-shadow-cover`
- 角标：播放量 tag — `background: $jm-color-tag`，`font-size: $jm-font-micro`，圆角 `$jm-radius-sm`
- 主按钮「去看看」→ 改名为 **「播放歌单」** 或 **「进入歌单」**
  - 高 `64rpx`，水平 padding `32rpx`，背景 `$jm-color-primary`，字 `$jm-color-text-inverse`，圆角 `$jm-radius-sm`
  - `:active` → 背景 `$jm-color-primary-dark`

### 3.3 Media Row（歌曲/歌单列表行）

| 元素 | 规格 |
|------|------|
| 行高 | min-height `120rpx`，padding `$jm-space-sm $jm-page-x` |
| 封面 | `96rpx` × `96rpx`，`border-radius: $jm-radius-sm` |
| 标题 | `$jm-font-body`，单行省略 |
| 副标题 | `$jm-font-caption`，`$jm-color-text-secondary` |
| 按压 | `:active { background: $jm-color-primary-soft; }` |
| 播放中 | 背景 `$jm-color-primary-soft` + 右侧 iconfont 播放图标 `$jm-color-primary` |

### 3.4 Album Grid Item（新碟两列）

- 容器：`flex` 两列，`gap: $jm-space-md`，`padding: 0 $jm-page-x`
- 封面：`calc((100vw - 2 * $jm-page-x - $jm-space-md) / 2)` 宽度，1:1
- **黑胶沟槽**：`::before` 改为 `background: $jm-color-player-from`，`opacity: 0.15`，位移减弱（`right: -24rpx`）
- 标题/歌手：各一行省略，间距 `8rpx`

### 3.5 Mini Player Bar（controlBar）

```
┌──────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓░░░░  ← 顶栏 2rpx 进度（primary）│
│ [封面48]  歌名 / 歌手    [播] [列表]      │
└──────────────────────────────────────────┘
     ↑ safe-area-inset-bottom
```

- 背景 `$jm-color-surface`，顶阴影 `0 -4rpx 24rpx rgba(0,0,0,0.06)`
- 封面 `96rpx`，圆形，细白边 `2rpx`
- 总高约 `128rpx` + safe-area
- 与播放页互斥显示逻辑保持不变

### 3.6 Full Player（playDetail）

- 面板：高 `38vh`，`linear-gradient(180deg, $jm-color-player-from, $jm-color-player-to)`
- 封面：`56vw` 圆形，`box-shadow: $jm-shadow-cover`，白边 `4rpx`
- 歌词：当前行 `$jm-color-text` + `font-weight: 600`；就绪行 `$jm-color-text-secondary`；行距 `1.8`
- 控制钮：图标 `$jm-color-text-inverse`，播放钮放大 `1.15`，间距均分 `60vw` 宽容器

### 3.7 空态 · 加载 · 触底

| 类型 | 样式 |
|------|------|
| Loading | 居中，图标 `$jm-color-primary` 可选旋转 |
| 空列表 | 图标 `$jm-color-text-tertiary`，文案 `$jm-font-body` |
| 「没有了~~」 | 改为「已经到底了」，色 `$jm-color-text-tertiary`，`padding: $jm-space-lg 0` |

### 3.8 详情页 Banner（listDetail / albumDetail）

- 头图高 `480rpx`，底部渐变遮罩 `linear-gradient(transparent, rgba(0,0,0,0.35))`
- 悬浮播放钮：圆形 `96rpx`，`$jm-color-primary`，阴影 `$jm-shadow-md`，压入 banner 下沿

---

## 4. 布局与单位规则

1. **一律 rpx**（除 `1px` 发丝线）。
2. 页面背景：`page { background: $jm-color-bg; }`。
3. 卡片/列表区背景：`$jm-color-surface` 或透明（由 Tab 内容决定）。
4. 删除/隔离桌面端：`-webkit-app-region`、`calc(100vh - …)` 窗口算法 → 改为 `flex: 1; min-height: 0`。
5. `navigationBar`：保持白底黑字，与 `$jm-color-surface` 一致；可选将来改为 `#F6F7F9` 无缝。

---

## 5. 文件落地映射（工程）

| 设计令牌/组件 | 目标文件 |
|---------------|----------|
| tokens | `src/styles/_variables.scss` |
| mixins（ellipsis、active、safe-bottom） | `src/styles/_mixins.scss` |
| 全局 page | `src/assets/reset.scss` |
| Tab | `src/pages/index/index.scss` |
| Hero + 列表 | `src/pages/recommend/recommend.scss` |
| 单曲列表 | `src/pages/newSong/newSong.scss` |
| 新碟网格 | `src/pages/album/album.scss` |
| 播放器 | `src/pages/playDetail/playDetail.scss` + `controlBar.scss` |
| 详情 | `listDetail.scss`、`albumDetail.scss` |

---

## 6. 品牌一句话

**沉韵 JMusic**：在浅色纸感界面里，用珊瑚色标出「正在播放」的温度，用轻微唱片意象留住音乐质感，安静但不冷淡。
