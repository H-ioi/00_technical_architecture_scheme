# -*- coding: utf-8 -*-
"""Dedupe duplicate import lines in merged list.vue script blocks."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = "// --- list logic (inlined from use-list.ts) ---"


def dedupe_script(script: str) -> str:
    lines = script.splitlines()
    seen_imports: set[str] = set()
    out: list[str] = []
    for line in lines:
        s = line.strip()
        if s.startswith("import "):
            if s in seen_imports:
                continue
            seen_imports.add(s)
        out.append(line)
    return "\n".join(out)


def main() -> None:
    for vue in (ROOT / "src" / "views").rglob("list.vue"):
        text = vue.read_text(encoding="utf-8")
        if MARKER not in text:
            continue
        m = re.search(r"(<script\s+setup[^>]*>)([\s\S]*?)(</script>)", text)
        if not m:
            continue
        script = dedupe_script(m.group(2))
        new_text = text[: m.start(2)] + script + text[m.end(2) :]
        if new_text != text:
            vue.write_text(new_text, encoding="utf-8")
            print(f"deduped {vue.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
