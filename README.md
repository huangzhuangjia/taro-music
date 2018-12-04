# taro-music

## Introduction

 本项目是基于 [Taro](https://github.com/NervJS/taro) + [Dva](https://dvajs.com/) 开发的音乐播放器小程序，是个人用于学习taro框架开发的，功能也相对简单，前期是用taro的redux版本开发，后面发现业务代码和页面耦合度高，就加入了dva，一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，通过它的model来降低耦合，也提升开发体验，效果不错。后台是网易云音乐[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/) 提供的API

 [![music.gif](https://github.com/huangzhuangjia/taro-music/blob/master/src/assets/image/music.gif?raw=true)](https://github.com/huangzhuangjia/taro-music/blob/master/src/assets/image/music.gif?raw=true)

## Usage

> 在运行项目之前需要先在本地运行 [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/) 项目，开启获取歌曲服务，默认端口是3000

```bash
$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git
$ cd NeteaseCloudMusicApi && npm install
$ npm start
```

>然后运行本项目，使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 导入项目（本项目根目录进行导入）

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
