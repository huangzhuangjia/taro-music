import Taro from '@tarojs/taro'

export function setCacheData(key, value) {
  Taro.setStorageSync(key, value)
}

export function getCacheData(key) {
  return Taro.getStorageSync(key)
}

// 设置一个全局对象
const globalData = {}

export function setGlobalData (key, val) {
  globalData[key] = val
}

export function getGlobalData (key) {
  return globalData[key]
}
