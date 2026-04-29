# Scripts

## `publish.mjs`（`npm run release`）

一键：**Prettier 检查 → `vue-tsc` → 打包库 → 打包文档 → `npm version` 递增版本 → `npm publish`**。

- 默认递增 **patch**；要 **minor** / **major**：`npm run release -- minor` 或 `npm run release -- major`。
- 版本写入 `package.json` / `package-lock.json` 时使用 `--no-git-tag-version`，不自动提交；发布成功后请按需 `git add`、`commit`、打 tag。
- 发布使用 `npm publish --ignore-scripts`，避免再次执行 `prepublishOnly`（与本脚本中的校验重复）。

执行前需已登录 npm（`npm login`），且 registry、权限符合包发布要求。
