# SVG Icons

Put source SVG files here, then run:

```sh
npm run icons:generate
```

File names are converted to component exports. For example:

- `copy.svg` -> `UniCopy`
- `user-add.svg` -> `UniUserAdd`
- `nav/home.svg` -> `UniNavHome`

By default, generated icons use `currentColor`. Use `npm run icons:generate -- --keep-colors` to preserve original SVG colors.

`fill="url(...)"` / `stroke="url(...)"` pattern references are always preserved.

## Logo

- Source bitmap: `logo-source.png`（Horizontal purple@3x 品牌稿）
- Vector output: `logo.svg`（由脚本从 PNG 轮廓追踪生成，`currentColor` 可主题染色）
- Regenerate:

```sh
python scripts/trace-logo-from-png.py
npm run icons:generate
```
