# -*- coding: utf-8 -*-
"""Post-fix merged list.vue: i18n destructure and script tag newline."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = ROOT / "src" / "views"
IMPORT_RE = re.compile(
    r"import\s+(?:type\s+)?[\s\S]*?from\s+['\"][^'\"]+['\"]\s*;?",
    re.MULTILINE,
)


def fix_script(content: str) -> str:
    content = re.sub(
        r"(<script\s+setup[^>]*>)(\s*import)",
        r"\1\n\2",
        content,
        count=1,
    )
    m = re.search(r"<script\s+setup[^>]*>([\s\S]*?)</script>", content)
    if not m:
        return content
    script = m.group(1)
    if "useUniI18n" not in script:
        return content
    if re.search(r"const\s+\{[^}]+\}\s*=\s*useUniI18n\(\)", script):
        return content

    needs_locale = "locale()" in script
    needs_t = bool(
        re.search(r"\bt\(", script)
        or re.search(r"const\s+tr\s*=\s*t\b", script)
    )
    if not needs_t and not needs_locale:
        return content

    if needs_t and needs_locale:
        hook = "const { locale, t } = useUniI18n()\n\n"
    elif needs_t:
        hook = "const { t } = useUniI18n()\n\n"
    else:
        hook = "const { locale } = useUniI18n()\n\n"

    imports = list(IMPORT_RE.finditer(script))
    if imports:
        last = imports[-1]
        idx = last.end()
        while idx < len(script) and script[idx] in " \t\n":
            idx += 1
        script = script[:idx] + "\n\n" + hook + script[idx:].lstrip()
    else:
        script = hook + script.lstrip()

    return content[: m.start(1)] + script + content[m.end(1) :]


def main() -> None:
    for vue in sorted(VIEWS.rglob("list.vue")):
        text = vue.read_text(encoding="utf-8")
        if "./use-list" in text:
            continue
        fixed = fix_script(text)
        if fixed != text:
            vue.write_text(fixed, encoding="utf-8")
            print(f"fixed {vue.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
