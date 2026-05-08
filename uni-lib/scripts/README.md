# Scripts

## `publish.mjs`（`npm run release`）

一键：**Prettier 检查 → `vue-tsc` → 打包库 → 打包文档 → `npm version` 递增版本 → `npm publish`**。

- 默认递增 **patch**；要 **minor** / **major**：`npm run release -- minor` 或 `npm run release -- major`。
- 版本写入 `package.json` / `package-lock.json` 时使用 `--no-git-tag-version`，不自动提交；发布成功后请按需 `git add`、`commit`、打 tag。
- 发布使用 `npm publish --ignore-scripts`，避免再次执行 `prepublishOnly`（与本脚本中的校验重复）。

执行前需已登录 npm（`npm login`），且 registry、权限符合包发布要求。

## `generate-icons.mjs`（`npm run icons:generate`）

将 `src/icons/svg` 下的 SVG 源文件批量转换为 Vue 组件，并自动生成 `src/icons/index.ts` 导出入口。

- `copy.svg` 会导出为 `UniCopyIcon`。
- `user-add.svg` 会导出为 `UniUserAddIcon`。
- `nav/home.svg` 会导出为 `UniNavHomeIcon`。
- 默认会把 `fill` / `stroke` 颜色转换为 `currentColor`，方便通过 `UniIcon` 的 `color` 控制。
- 多色图标可使用 `npm run icons:generate -- --keep-colors` 保留原始颜色。
