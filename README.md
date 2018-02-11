## 开发者工具使用

1. 使用微信开发者工具新建项目，本地开发选择dist目录。
2. 微信开发者工具-->项目-->关闭ES6转ES5。重要：漏掉此项会运行报错。
3. 微信开发者工具-->项目-->关闭上传代码时样式自动补全 重要：某些情况下漏掉此项会也会运行报错。
4. 微信开发者工具-->项目-->关闭代码压缩上传 重要：开启后，会导致真机computed, props.sync 等等属性失效。#270
项目根目录运行wepy build --watch，开启实时编译。

## 编译
#### 开发
`npm run app`

#### 切换域名
`server=zhangyuren npm run app`

#### 测试发布
`npm run build:test`

#### 生产发布
`npm run build:prod`


> JS代码规范
  https://github.com/standard/standard/blob/master/docs/README-zhcn.md
  变量和函数为驼峰法（ camelCase）
  全局变量为大写 (UPPERCASE )
  常量 (如 PI) 为大写 (UPPERCASE )

> 配置说明

1. get_domain_host 获取商户domain
2. api_host API地址
3. global_duration 全局提示显示时长
4. global_timeout 全局网络请求超时时长
