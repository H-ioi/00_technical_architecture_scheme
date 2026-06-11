# Theme

主题变量统一定义在 `src/styles/variables.scss`，通过根节点 `data-layout` 切换。

## 基础用法

```ts
document.documentElement.dataset.layout = 'isa-light'
```

`UniLayout` 会在初始化时把 `preset` 写入根节点：

```vue
<UniLayout preset="isa-light" />
```

## Layout

| Layout      | 说明                         |
| ----------- | ---------------------------- |
| `default`   | 组件库默认主题               |
| `isa-light` | ISA 管理后台浅色主题         |
| `ems-dark`  | EMS 深色侧栏 + 金色强调主题  |
| `mas-dark`  | MAS 深色侧栏 + 金色强调主题  |

组件库只提供无品牌主题 token，Logo、登录页背景、产品线专属视觉资源仍由业务工程维护。
