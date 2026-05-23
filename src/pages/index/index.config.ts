export default definePageConfig({
  enablePullDownRefresh: true,
  navigationBarTitleText: 'JMusic',
  // 用时注入：Tab 面板等组件在首次渲染时再注入，占位避免阻塞
  componentPlaceholder: {
    comp: 'view'
  }
})

function definePageConfig(config: Taro.PageConfig) {
  return config
}
