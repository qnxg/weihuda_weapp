# 湖大微生活小程序

## 1. 概览

### 技术栈

| 名称               | 文档地址                                                          | 备注                                     |
| ------------------ | ----------------------------------------------------------------- | ---------------------------------------- |
| 微信小程序开发文档 | https://developers.weixin.qq.com/miniprogram/dev/framework/       | 微信小程序官方文档                       |
| Taro               | https://taro-docs.jd.com/docs/                                    | 移动端解决方案                           |
| React              | https://zh-hans.react.dev/reference/react                         | JS界面构建库                             |
| redux              | https://cn.redux.js.org/tutorials/index                           | 数据仓库                                 |
| dayjs              | https://www.npmjs.com/package/dayjs https://dayjs.gitee.io/zh-CN/ | 轻量的处理时间和日期的 JavaScript 库     |
| classnames         | https://www.npmjs.com/package/classnames                          | 处理类名的工具                           |
| entities           | https://www.npmjs.com/package/entities                            | 解析HTML                                 |
| Typescript         | https://ts.nodejs.cn/                                             | 一种基于 JavaScript 构建的强类型编程语言 |

### 项目结构

```shell
src
├─ apis                                 # 网络请求
│  ├─ back                              # 后端有关的请求
│  ├─ hdjw                              # 教务系统有关的请求
│  ├─ pt                                # 个人门户有关的请求
│  └─ \*\*                              # 其他未分类的请求
├─ components                           # 项目中通用的组件
├─ hooks                                # 项目中通用的hook
├─ models                               # 数据仓库
├─ pages                                # 小程序页面，参考app.config.ts
├─ queryPage                            # 分包页面，参考app.config.t
├─ static                               # 静态资源目录
├─ utils                                # 项目中通用的一些工具函数集
│  ├─ scss                              # sass全局变量、工具集
│  ├─ config.ts                         # 一些业务有关的全局配置
│  ├─ day.ts                            # 计算日期相关的函数封装
│  ├─ request.ts                        # 请求处理函数封装
│  ├─ storage.ts                        # 本地存储相关的函数封装
│  ├─ tool.ts                           # 通用的工具函数
│  ├─ url.ts                            # BASE_URL
│  └─ getLoginCode.ts                   # 封装Taro.login()操作
├─ app.config.ts                        # 小程序入口，相当于小程序中的app.json
├─ app.scss                             # 全局样式
├─ app.tsx                              # 入口文件
├─ index.html                           # index.html
└─ theme.json                           # 主题变量
```

## 2. 快速开始

本项目使用[yarn](https://github.com/yarnpkg/yarn/)管理依赖。请不要混用`npm`，否则可能会出现依赖相关的问题。提示：如果你在开发过程中发现项目下出现`package-lock.json`，则你很可能已经使用了`npm`。

在开始前，请确认已经安装并配置好Node.js。

请首先将项目克隆到本地并创建自己的开发分支，然后

1. 安装依赖

```shell
npx yarn
```

2. 启动项目

```shell
npx yarn dev
```

运行以上命令后当前工作目录中会出现`dist`文件夹，这是项目的打包结果，同时会监听文件变化，每次文件发生变化时都会重新打包。你需要：

1. 打开微信开发者工具

2. 点击右上角的 `导入`

3. 选择 `dist` 目录

4. 在后端服务中选择 `不使用云开发`

5. 点击确定按钮

注意：

1. 小程序控制台可能会报类似“你不是本项目的开发者”的错误。解决方法之一是找小程序管理员成为小程序的开发者（在微信公众平台中操作）。你也可以临时使用测试号，并将`./src/utils/getLoginCode.ts`中的`useTestingCode`置为`true`。

2. 本地开发：

- 进入`src/utils/url.ts`中，使用注释/取消注释的方式切换环境。

- 使用本地请求时，需要在微信开发者工具-详情（右上角）-本地设置中勾选不校验合法域名。

## 3. 部署

上线之前你需要：

1. 确保 `src/utils/url.ts` 中的BASE_URL为正式环境

2. 确保 `./src/utils/getLoginCode.ts` 中的 `useTestingCode` 为 `false`

3. 设置中取消勾选不校验合法域名选项，然后对你所写的功能进行测试

运行以下命令对项目打包：

```shell
npx yarn build
```

点击微信开发者工具右上角的 `上传` 按钮

之后在微信公众平台中进行上线相关的操作。
