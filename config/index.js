import { resolve } from 'path'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'

const config = {
  projectName: 'hnu_query',
  date: '2020-7-8',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  alias: {
    '@': resolve(__dirname, '..', 'src'),
  },
  copy: {
    patterns: [{ from: 'src/static/tab/', to: 'dist/static/tab/' }],
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      autoprefixer: {
        enable: true,
      },
      pxtransform: {
        enable: true,
      },
      url: {
        enable: true,
        config: {
          limit: 10240, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[folder]__[local]___[sha512:hash:base64:5]',
          localIdentHashSalt: '1000@hnu',
        },
      },
    },
    webpackChain(chain, _webpack) {
      chain.merge({
        performance: {
          // 生成文件的体积警告 500kb
          maxAssetSize: 512000,
        },
      })
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro',
              },
            ],
          },
        },
      })
    },
  },
  h5: {
    esnextModules: ['@taroify'],
  },
}

export default function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
