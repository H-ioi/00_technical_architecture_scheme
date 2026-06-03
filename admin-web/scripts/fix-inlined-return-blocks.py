# -*- coding: utf-8 -*-
"""Remove stray composable return blocks left after merge-use-list-into-vue.py."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = ROOT / "src" / "views"

MARKER = "// --- list logic (inlined from use-list.ts) ---"

# return { ... } immediately before tableEmpty or </script>
PATTERN = re.compile(
    r"\n  return \{\n(?:    [^\n]+\n)+  \}\n(?=\nconst tableEmpty|\n</script>)",
    re.MULTILINE,
)


def main() -> None:
    n = 0
    for vue in VIEWS.rglob("list.vue"):
        text = vue.read_text(encoding="utf-8")
        if MARKER not in text:
            continue
        new_text, count = PATTERN.subn("\n", text)
        if count:
            vue.write_text(new_text, encoding="utf-8")
            print(f"fixed {count} block(s): {vue.relative_to(ROOT)}")
            n += count
    print(f"total removed: {n}")


if __name__ == "__main__":
    main()
