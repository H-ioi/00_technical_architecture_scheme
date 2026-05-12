# Theme

`createUniTheme()` 提供运行时主题变量写入能力，默认主题变量定义在组件库样式中。

## 基础用法

```ts
import { createUniTheme } from 'uni-ui-lib'

const theme = createUniTheme({
  primaryColor: '#1677ff',
  pageBgColor: '#f5f7fb'
})

theme.apply({
  primaryColor: '#13c2c2'
})
```

也可以在安装组件库时传入：

```ts
app.use(UniLib, {
  theme: {
    primaryColor: '#1677ff'
  }
})
```

## Token

| Token                | CSS 变量                     |
| -------------------- | ---------------------------- |
| `primaryColor`       | `--uni-color-primary`        |
| `pageBgColor`        | `--uni-bg-page`              |
| `cardBgColor`        | `--uni-bg-card`              |
| `borderColor`        | `--uni-border-color`         |
| `textColor`          | `--uni-text-color`           |
| `textColorSecondary` | `--uni-text-color-secondary` |
| `radiusBase`         | `--uni-radius-base`          |

组件库只提供无品牌主题 token，Logo、登录页背景、产品线专属视觉资源仍由业务工程维护。
