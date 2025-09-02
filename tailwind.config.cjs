/** @type {import('tailwindcss').Config} */
module.exports = {
  // 这里给出了一份 taro 通用示例，具体要根据你自己项目的目录结构进行配置
  // 比如你使用 vue3 项目，你就需要把 vue 这个格式也包括进来
  // 不在 content glob 表达式中包括的文件，在里面编写 tailwindcss class，是不会生成对应的 css 工具类的
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  // 其他配置项 ...
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#328CCB',
        // score0: '#ff4545',
        // score1: '#ff694f',
        // score2: '#f8603a',
        // score3: '#fc8354',
        // score4: '#fa9231',
        // score5: '#f7bb3b',
        // score6: '#ecdb44',
        // score7: '#e2ec52',
        // score8: '#b0d628',
        // score9: '#a9b42a',
        // score10: '#37da58',
      },
    },
  },
}
