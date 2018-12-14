# taro-music

## Introduction

 本项目是基于 [Taro](https://github.com/NervJS/taro) + [Dva](https://dvajs.com/) + [TypeScript](https://www.tslang.cn/index.html) 开发的音乐播放器小程序，是个人用于学习taro框架开发的，功能也相对简单，当然也存在一些不足，前期是用taro的redux版本开发，后面发现业务代码和页面耦合度高，就加入了dva，一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，这里只用了dva的一个核心 [dva-core](https://github.com/dvajs/dva/tree/master/packages/dva-core)，用于model层来降低耦合，用 [dva-model-extend](https://github.com/dvajs/dva-model-extend) 复用 model，大大提升了开发体验，效果不错。后台是网易云音乐[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/) 提供的API，目前该项目还没有正式上线到小程序。

 [![music.gif](https://github.com/huangzhuangjia/taro-music/blob/master/src/assets/image/music.gif?raw=true)](https://github.com/huangzhuangjia/taro-music/blob/master/src/assets/image/music.gif?raw=true)

## Usage

> 本项目已经使用了线上api接口，所以无需运行后台也可以获取数据，当然你也可以在本地运行 [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/) 项目，开启获取歌曲服务，默认端口是3000

```bash
$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git
$ cd NeteaseCloudMusicApi && npm install
$ npm start
```

>在运行本项目前，确保系统已经全局安装了taro，[安装可详见这里](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)，安装完运行项目后使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 导入项目（本项目根目录进行导入），开发前注意事项可查看: https://nervjs.github.io/taro/docs/before-dev-remind.html

```bash
# git clone
$ git clone https://github.com/huangzhuangjia/taro-music.git
# install
$ npm i
# or yarn install
$ yarn install
# development
$ npm run dev:weapp
# production
$ npm run build:weapp
```
