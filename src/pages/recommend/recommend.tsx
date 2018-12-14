import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getCacheData } from '../../utils/index'
import { fetchRecommendList, updateState } from '../../actions'

import './recommend.scss'

interface RecommendProps {
  recommendList: any;
  onFetchRecommendList: (payload: { callback: any }) => any;
  onUpdateState: (namespace: string, payload: any) => any;
}

const mapStateToProps = ({ recommend }) => ({
  recommendList: recommend.recommendList
})
const mapDispatchToProps = ({
  onFetchRecommendList: fetchRecommendList,
  onUpdateState: updateState
})

@connect(mapStateToProps, mapDispatchToProps)
class Recommend extends Component<RecommendProps, {}> {
  static options = {
    addGlobalClass: true
  }
  constructor() {
    super(...arguments)
  }

  getRecommendList() {
    let recommendList = getCacheData('recommendList')
    if (recommendList && recommendList.length > 0) {
      this.props.onUpdateState('recommend', { recommendList })
    } else {
      this.fetchRecommendList()
    }
  }
  fetchRecommendList(callback?: any) {
    this.props.onFetchRecommendList({ callback })
  }

  getPlayCount(num: number): string {
    let str
    if(num > 10000) {
      str = (num / 10000).toFixed(0)
      str += '万'
    }else {
      str = num
    }
    return str
  }

  navigateTo(url: string) {
    Taro.redirectTo({url: url})
  }

  render() {
    let { recommendList } = this.props
    const RecommendList = recommendList.slice(1).map((data, k) => {
      return (
        <View onClick={this.navigateTo.bind(this, `/pages/listDetail/listDetail?id=${data.id}`)} key={k}>
          <View className='album-itembox'>
            <View className='cover'>
              <Image src={data.picUrl} lazyLoad></Image>
            </View>
            <View className='r'>
              <View className='desc'>{data.name}</View>
              <View className='num'>
                <View className='iconfont icon-iconset0271'></View>
                <Text>{this.getPlayCount(data.playCount)}</Text>
              </View>
            </View>
          </View>
        </View>
      )
    })
    return (
      <View className='recommend-wrapper'>
        {
          recommendList.length > 0 ?
            (<View className='recommend-banner'>
              <View className='cover'>
                <View className='list-tag'><View className='iconfont icon-iconset0271'></View>
                  <Text>{this.getPlayCount(recommendList[0].playCount)}</Text>
                </View>
                <Image src={recommendList[0].picUrl || ''} lazyLoad></Image>
              </View>
              <View className='info'>
                <Text className='name'>{recommendList[0].name || ''}</Text>
                <Text className='desc'>{recommendList[0].copywriter || ''}</Text>
                <View onClick={this.navigateTo.bind(this,`/pages/listDetail/listDetail?id=${recommendList[0].id}`)}>
                  <View className='play-btn'>
                    <View className='iconfont icon-bofang1'></View><Text>去看看</Text>
                  </View>
                </View>
              </View>
            </View>) : null
        }
        <ScrollView
          className='item-list'
          scrollWithAnimation
          scrollTop='0'
          scrollY >
          {RecommendList}
        </ScrollView>
      </View>
    )
  }
}

export default Recommend
