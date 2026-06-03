# -*- coding: utf-8 -*-
"""Merge views/**/use-list.ts into sibling list.vue and delete use-list.ts."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = ROOT / "src" / "views"


def find_matching_brace(text: str, open_index: int) -> int:
    depth = 0
    for i in range(open_index, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return i
    raise ValueError("unbalanced {}")


def find_matching_paren(text: str, open_index: int) -> int:
    depth = 0
    for i in range(open_index, len(text)):
        if text[i] == "(":
            depth += 1
        elif text[i] == ")":
            depth -= 1
            if depth == 0:
                return i
    raise ValueError("unbalanced ()")


def unwrap_hook(ts: str) -> tuple[str, str, str]:
    m = re.search(
        r"export\s+(?:const\s+((?:\w+))\s*=\s*|function\s+((?:\w+))\s*)"
        r"(\([^)]*\)|\(\))\s*(?:=>)?\s*\{",
        ts,
    )
    if not m:
        raise ValueError("export hook not found")
    hook_name = m.group(1) or m.group(2)
    open_brace = m.end() - 1
    close_brace = find_matching_brace(ts, open_brace)
    body = ts[m.end() : close_brace].strip()
    body = re.sub(r"\nreturn\s*\{[\s\S]*?\}\s*$", "", body).strip()
    preamble = ts[: m.start()].strip()
    preamble = re.sub(
        r"^export\s+(type|interface)\s+", r"\1 ", preamble, flags=re.MULTILINE
    )
    return preamble, hook_name, body


def parse_vue_script(vue: str) -> tuple[str, str, str]:
    m = re.search(r"<script\s+setup[^>]*>([\s\S]*?)</script>", vue)
    if not m:
        raise ValueError("no script setup")
    return vue[: m.start(1)], m.group(1), vue[m.end(1) :]


def merge_import_lines(existing: str, new_block: str) -> str:
    imports: list[str] = []
    seen: set[str] = set()
    rest: list[str] = []
    for line in (existing + "\n" + new_block).splitlines():
        s = line.strip()
        if s.startswith("import "):
            if s not in seen:
                seen.add(s)
                imports.append(line)
        else:
            rest.append(line)
    return "\n".join(imports + [""] + rest).strip()


def remove_use_list_imports(script: str) -> str:
    return "\n".join(
        line
        for line in script.splitlines()
        if "./use-list" not in line and "'./use-list'" not in line
    )


def remove_hook_destructure(script: str, hook_name: str) -> str:
    token = f"= {hook_name}("
    idx = script.find(token)
    if idx < 0:
        token = f"={hook_name}("
        idx = script.find(token)
    if idx < 0:
        raise ValueError(f"call to {hook_name} not found")
    # walk back to `const {`
    start = script.rfind("const {", 0, idx)
    if start < 0:
        raise ValueError("destructure start not found")
    paren_open = script.index("(", idx)
    paren_close = find_matching_paren(script, paren_open)
    end = paren_close + 1
    while end < len(script) and script[end] in " \t":
        end += 1
    if end < len(script) and script[end] == ";":
        end += 1
    if script[end : end + 1] == "\n":
        end += 1
    return script[:start] + script[end:]


def process_pair(use_list: Path) -> None:
    vue = use_list.parent / "list.vue"
    if not vue.exists():
        print(f"SKIP no list.vue: {use_list}")
        return

    ts = use_list.read_text(encoding="utf-8")
    preamble, hook_name, hook_body = unwrap_hook(ts)
    vue_text = vue.read_text(encoding="utf-8")
    pre, script, post = parse_vue_script(vue_text)

    script = remove_use_list_imports(script)
    script = remove_hook_destructure(script, hook_name)

    pre_imports = "\n".join(
        line for line in preamble.splitlines() if line.strip().startswith("import ")
    )
    pre_rest = "\n".join(
        line
        for line in preamble.splitlines()
        if line.strip() and not line.strip().startswith("import ")
    )

    script = merge_import_lines(script, pre_imports)
    logic = f"\n// --- list logic (inlined from use-list.ts) ---\n{pre_rest}\n\n{hook_body}\n"
    marker = "const tableEmpty = useListTableEmpty"
    if marker in script:
        script = script.replace(marker, logic + "\n" + marker, 1)
    else:
        script = script.rstrip() + logic + "\n"

    vue.write_text(pre + script + post, encoding="utf-8")
    use_list.unlink()
    print(f"OK {use_list.relative_to(ROOT)}")


def main() -> None:
    for f in sorted(VIEWS.rglob("use-list.ts")):
        try:
            process_pair(f)
        except Exception as e:
            print(f"FAIL {f.relative_to(ROOT)}: {e}")


if __name__ == "__main__":
    main()
