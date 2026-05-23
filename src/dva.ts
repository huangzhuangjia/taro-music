import { create } from 'dva-core'
import { createLogger } from 'redux-logger'
import createLoading from 'dva-loading'

let app: ReturnType<typeof create>
let store: any
let dispatch: any

function createApp(options?: any) {
  const { models } = options
  if (process.env.NODE_ENV === 'development') {
    options.onAction = [createLogger()]
  }
  app = create({
    ...options
  })
  app.use(createLoading({}))

  if (!globalThis.registered) models.forEach((model: any) => app.model(model))
  globalThis.registered = true
  app.start()

  store = app._store
  app.getStore = () => store

  dispatch = store.dispatch

  app.dispatch = dispatch
  return app
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch
  }
}
