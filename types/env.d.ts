declare namespace NodeJS {
  interface ProcessEnv {
    TARO_APP_API: string
    NODE_ENV: 'development' | 'production'
  }
}

declare var registered: boolean | undefined
