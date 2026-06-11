# 主题

`uni-lib` 使用 CSS 变量作为主题协议。主题变量集中写在 `src/styles/variables.scss`，通过切换根节点 `data-layout` 属性启用对应主题。

```ts
document.documentElement.dataset.layout = 'isa-light'
```
