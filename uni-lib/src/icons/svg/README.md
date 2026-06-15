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
