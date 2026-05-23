# taro-music

基于 Taro 4 + React 18 + Dva + TypeScript 的网易云音乐小程序播放器。

## 技术栈

- Taro 4.2
- React 18
- dva-core（状态管理）
- NeteaseCloudMusicApi（后端 API）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动 API 服务

项目依赖 [NeteaseCloudMusicApi](https://www.npmjs.com/package/NeteaseCloudMusicApi) 提供数据，默认端口 `3000`：

```bash
npm run api
```

开发环境 API 地址在 `.env.development` 中配置：

```
TARO_APP_API=http://127.0.0.1:3000
```

生产环境请修改 `.env.production` 中的 `TARO_APP_API`，并在微信公众平台配置 request 合法域名。

### 3. 编译小程序

```bash
npm run dev:weapp
```

使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 导入项目根目录（`project.config.json` 中 `miniprogramRoot` 指向 `dist/`）。

开发阶段可在开发者工具中关闭「不校验合法域名」。

### 4. 生产构建

```bash
npm run build:weapp
```

## 项目结构

```
src/
├── app.tsx / app.config.ts   # 应用入口与路由
├── models/                   # dva 数据模型
├── pages/                    # 页面
├── components/               # 公共组件
├── services/                 # API 请求
└── utils/                    # 工具函数
```

## 功能

- 推荐歌单 / 最新单曲 / 新碟上架
- 歌单与专辑详情
- 后台音频播放、歌词、播放列表
- 列表循环 / 单曲循环 / 随机播放

## 注意事项

- 第三方 API 仅供学习，请遵守版权与平台规范
- `project.config.json` 中的 `appid` 需替换为你自己的小程序 AppID
