微前端构建（`VITE_MICRO_MODE=true`）时，`vite.config.js` 将 `shared` 别名指向本目录。

本示例的共享组件仍通过 `shared-components` workspace 与 `@/shared/components.js` 解析；若你希望完全模拟「externals 目录占位」，可在此放置与主应用一致的 shim 文件。
