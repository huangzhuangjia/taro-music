import Taro from '@tarojs/taro'

export function setCacheData(key: string, value: any) {
  Taro.setStorageSync(key, value)
}

export function getCacheData(key: string) {
  return Taro.getStorageSync(key)
}

// 设置一个全局对象
const globalData: object = {}

export function setGlobalData (key: string, val: any) {
  globalData[key] = val
}

export function getGlobalData (key: string) {
  return globalData[key]
}
