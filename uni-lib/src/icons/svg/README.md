# SVG Icons

Put source SVG files here, then run:

```sh
npm run icons:generate
```

File names are converted to component exports. For example:

- `copy.svg` -> `UniCopyIcon`
- `user-add.svg` -> `UniUserAddIcon`
- `nav/home.svg` -> `UniNavHomeIcon`

By default, generated icons use `currentColor`. Use `npm run icons:generate -- --keep-colors` to preserve original SVG colors.
