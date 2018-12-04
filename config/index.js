'use strict';

var config = {
  projectName: 'taro-music',
  date: '2018-11-8',
  designWidth: 750,
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: ['transform-class-properties', 'transform-decorators-legacy', 'transform-object-rest-spread']
    }
  },
  defineConstants: {},
  weapp: {

  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        }
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require("./dev.js"));
  }
  return merge({}, config, require("./prod.js"));
};
