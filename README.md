# 湖大微生活小程序

## 1. 概览

### 技术栈

| 名称               | 文档地址                                                          | 备注                                                          |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| 微信小程序开发文档 | https://developers.weixin.qq.com/miniprogram/dev/framework/       | 微信小程序官方文档                                            |
| Taro               | https://taro-docs.jd.com/docs/                                    | 移动端解决方案                                                |
| React              | https://zh-hans.react.dev/reference/react                         | JS界面构建库                                                  |
| Dayjs              | https://www.npmjs.com/package/dayjs https://dayjs.gitee.io/zh-CN/ | 轻量的处理时间和日期的 JavaScript 库  |
| classnames         | https://www.npmjs.com/package/classnames                          | 处理类名的工具                                                |
| Typescript         | https://ts.nodejs.cn/                                             | 一种基于 JavaScript 构建的强类型编程语言                      |
| Eslint             | https://eslint.org/docs/latest/                                   | 增强对 Javascript 的语法检查                                  |
| Prettier           | https://prettier.io/docs/                                         | 代码格式化工具                                                |
| TailwindCSS        | https://v3.tailwindcss.com/docs                                   | 提供很多原子的工具类来写样式（**[已弃用，即将移除该依赖](https://code.qnxg.cn/qnxg/front/issues/139)**） |

### 项目结构

```shell
src
├─ apis                                 # 网络请求
│  ├─ hdjw                              # 教务系统有关的请求
│  ├─ pt                                # 个人门户有关的请求
│  └─ \*\*                              # 其他未分类的请求
├─ components                           # 项目中通用的组件，具体用法见注释和项目中已有的示例
├─ pages                                # 小程序主要页面，参考app.config.ts
├─ queryPage                            # 分包页面（工具箱里的页面），主要包括查询相关，参考app.config.ts
├─ settingsPage                         # 分包页面，包括小程序设置页面，参考app.config.ts
├─ static                               # 静态资源目录
├─ utils                                # 项目中通用的一些工具函数集
│  ├─ hooks                             # 项目中常用的自定义hook
│  │  ├─ usePromise.ts                  # 本项目推荐使用该Hook管理异步逻辑
│  │  └─ \*\*                           # 其他自定义Hook
│  ├─ scss                              # sass全局变量、工具集
│  ├─ storage                           # 本地存储和小程序设置相关
│  ├─ config.ts                         # 一些业务有关的全局配置
│  ├─ day.ts                            # 计算日期相关的函数封装
│  ├─ getLoginCode.ts                   # 封装Taro.login()操作
│  ├─ tool.ts                           # 通用的工具函数
│  └─ url.ts                            # BASE_URL
├─ app.config.ts                        # 小程序入口，相当于小程序中的app.json
├─ app.scss                             # 全局样式
├─ app.tsx                              # 入口文件
├─ index.html                           # index.html
├─ theme.scss                           # 全局样式
└─ theme.json                           # 主题变量
```

## 2. 快速开始

在开始前，请确认已经安装并配置好 Node.js。

本项目使用 [Yarn Modern](https://github.com/yarnpkg/berry) 管理依赖。请不要混用 `npm`，否则可能会出现依赖相关的问题。提示：如果你在开发过程中发现项目下出现 `package-lock.json`，则你很可能已经使用了 `npm`。

如果你没有配置过 Yarn，请运行 `corepack enable` 命令启用 Corepack，随后即可执行有关 Yarn 的命令。要详细了解 Corepack，请参考 [nodejs/corepack](https://github.com/nodejs/corepack#readme) 或 [Yarn 帮助页面](https://yarnpkg.com/corepack)。

如果你之前使用过 Yarn Classic (1.x)，在启用 Corepack 后你无需任何操作即可自动切换至 Yarn Modern，所以请确保使用 Corepack 管理你的包管理器。此外，建议阅读 [Yarn 迁移文档](https://yarnpkg.com/migration/guide)以了解 Yarn Modern 的破坏性变更。

请首先将项目克隆到本地并创建自己的开发分支，然后

1. 安装依赖

```shell
yarn
```

2. 启动项目

```shell
yarn dev
```

运行以上命令后当前工作目录中会出现`dist`文件夹，这是项目的打包结果，同时会监听文件变化，每次文件发生变化时都会重新打包。你需要：

1. 打开微信开发者工具

2. 点击右上角的 `导入`

3. 选择 `dist` 目录

4. 在后端服务中选择 `不使用云开发`

5. 点击确定按钮

注意：

*   小程序控制台可能会报类似“你不是本项目的开发者”的错误。解决方法之一是找小程序管理员成为小程序的开发者（管理员需要在微信公众平台中操作），你也可以临时使用测试号。

    测试号使用方法如下：

    在项目根目录创建 `.env.local` 文件，并添加内容如下：
    
        ```env
        TARO_APP_USE_TESTING_CODE=true  
        ```

    测试号的原理大致是这样的：当小程序进行绑定的时候，会获取你当前微信账号的 openid。如果你还没有被设置为小程序的开发者，那么你的 openid 就无法通过微信开发者工具的校验。当设置启用测试号的时候，小程序在绑定时就会跳过获取 openid 的步骤，认为当前的 openid 是 `testing`，并将对应的学号的 openid 变成 `testing`。如果你连接本地数据库开测试号的话一般没有什么问题。如果你连接生产环境开测试号的话，可能会有如下的问题：

        1. 你的学号对应的 openid 会变成 `testing`，而不是你自己微信号的 openid。这可能会导致你平时自己正常使用微生活的时候会有一些问题，因为你的 openid 不再对应任何学号了。（不过目前可能最多只出现突然让你重新绑定的情况）。解决办法是自己从在自己的微信上重新绑定下自己的学号。

        2. 如果有多人在用测试号，那么就会有多个学号的 openid 是 `testing`。这可能会出现，你在清完小程序的缓存后，重新进入小程序，发现账号变成别人的了。

        3. 目前后端在解绑时，会把对应 openid 为当前 openid 的学号的 openid 全部清空。这可能导致，多人在使用测试号时，有一个人点了解绑，那么其他人在清完小程序的缓存后，也需要重新绑定了。

        4. 测试号部分的鉴权很弱（基本没鉴权了），所以任何人都可以拿到测试号对应的学号的令牌。因此测试号存在隐私泄露的风险。
    

*   使用本地请求时，需要在微信开发者工具-详情（右上角）-本地设置中勾选不校验合法域名。

## 3. 本地环境配置

项目下的`.env`文件定义了一些影响编译结果的变量，如后端URL `TARO_APP_BASE_URL`、是否使用测试号 `TARO_APP_USE_TESTING_CODE` 等。如果需要本地临时改动这些变量，你可以在项目下创建`.env.local`文件，该文件中的变量会优先于`.env`文件中的变量使用。`.env.local`文件已经被`.gitignore`排除，因此减少了不小心把测试配置推送到远程的可能。

## 4. 测试

微信开发者工具提供了“模拟器”功能。可以对小程序界面进行模拟。模拟器底部有“打开webview调试页”的按钮。可以检查网络请求、样式表、元素、控制台输出等，使用方法和浏览器的开发者工具相同。注意：快捷键F12打开的是微信开发者工具本身的调试页，无法用于调试小程序。

某些情况下，模拟器和真机的行为并不相同。如果想要在真机上测试，可以点击工具栏上的“预览”按钮，或者使用快捷键“Ctrl+Shift+P”，然后使用真机上的微信扫描生成的二维码即可。开始真机调试后可能会出现类似网络请求无法完成的问题，可以在右上角的更多按钮里选择“开发调试”>“打开调试”，如果不是小程序本身的bug的话就能解决。

## 5. 代码检查与格式化

### 代码检查——`lint`脚本

Typescript是基于JavaScript的开源编程语言，它通过添加静态类型检查让开发者在编译阶段就能捕捉到很多潜在的错误，从而大大提升代码的安全性和可维护性。

ESLint是一个JavaScript和TypeScript的静态检查工具。它能够帮助开发者发现和修复潜在的语法错误、代码风格问题以及可能导致 bug 的不规范写法。

本项目配置了Typescript和ESlint规则。编辑时可以在编辑器上安装相关插件。如果你使用的是VSCode（自带Typescript支持），考虑附加安装ESlint插件，减少引入bug的可能。

如果想要在命令行触发代码检查，本项目提供了`lint`命令：

```shell
yarn lint
```

该命令在运行后会先进行Typescript检查，如果通过会继续进行ESlint检查。

### 格式化——`fmt`脚本

Prettier是一个支持多语言的代码格式化工具，它使得在多人协作开发的时候保持代码格式的一致。

本项目使用prettier对代码进行格式化。由于prettier与vscode默认格式化冲突，你可能需要安装prettier插件并进行配置。

如果你不想影响本地全局vscode设置，可在先安装prettier插件后将该插件全局禁用，然后仅在“工作区”启用。并在该项目下配置`.vscode/settings.json`：
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

请在编写代码完毕之后在命令行中执行：
```shell
yarn fmt
```
将使用Prettier对代码进行格式化。

如果要在代码某处禁用prettier，你可以使用`/* prettier-ignore */`。详见[prettier文档](https://prettier.io/docs/ignore)。

## 6. Gitea工作流

工作流文件位于`.gitea/workflows`。这里定义了Gitea项目仓库在某些事件下的执行脚本。

### PR 检查

在向主分支提起PR时会自动运行，若检查不通过会进行标识。目前的检查项目为prettier、typescript和eslint。如果想要在本地模拟PR检查，你可以运行：

```shell
yarn pr-check
```

## 7. 部署

上线之前你需要：

1. 确保`.env`文件和`.env.local`等文件的配置是正确的。各个URL应为正式环境，且`TARO_APP_USE_TESTING_CODE`应当为`false`。
2. 设置中取消勾选不校验合法域名选项，然后对你所写的功能进行测试

运行以下命令对项目打包：

```shell
yarn build
```

点击微信开发者工具右上角的 `上传` 按钮

之后在微信公众平台中就可以看到新上传的小程序版本。小程序在发布前需要先提交到微信官方审核，提交审核时只需要提供一个小程序的首页截图，其他信息都不用补充或是修改，即可通过审核。

通过审核之后小程序不会自动发布，需要再自己从后台手动点击发布。
