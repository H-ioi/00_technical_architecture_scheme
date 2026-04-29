# UniForm

动态表单编排组件，基于 Element Plus 表单原子组件，使用单一 `config` 对象初始化字段、分组、布局、联动和查看/编辑模式。

## 基础用法

```vue
<UniForm v-model="formModel" :config="formConfig" :mode="mode" />
```

## 联动

字段可通过 `dependencies` 声明依赖，并使用 `visible`、`disabled`、`onChange`、`actions.setValue()`、`actions.clearValue()` 等能力完成显隐和值联动。
