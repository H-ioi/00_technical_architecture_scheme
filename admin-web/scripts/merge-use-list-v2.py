# -*- coding: utf-8 -*-
"""Merge views/**/use-list.ts into sibling list.vue (v2 — preserves multiline imports)."""
from __future__ import annotations

import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = ROOT / "src" / "views"

IMPORT_RE = re.compile(
    r"import\s+(?:type\s+)?[\s\S]*?from\s+['\"]([^'\"]+)['\"]\s*;?",
    re.MULTILINE,
)


def find_matching(text: str, open_index: int, open_ch: str, close_ch: str) -> int:
    depth = 0
    for i in range(open_index, len(text)):
        if text[i] == open_ch:
            depth += 1
        elif text[i] == close_ch:
            depth -= 1
            if depth == 0:
                return i
    raise ValueError(f"unbalanced {open_ch}{close_ch}")


def split_top_level(text: str, sep: str = ",") -> list[str]:
    parts: list[str] = []
    depth_paren = depth_brace = depth_bracket = 0
    current: list[str] = []
    for ch in text:
        if ch == "(":
            depth_paren += 1
        elif ch == ")":
            depth_paren -= 1
        elif ch == "{":
            depth_brace += 1
        elif ch == "}":
            depth_brace -= 1
        elif ch == "[":
            depth_bracket += 1
        elif ch == "]":
            depth_bracket -= 1
        elif ch == sep and depth_paren == depth_brace == depth_bracket == 0:
            parts.append("".join(current).strip())
            current = []
            continue
        current.append(ch)
    tail = "".join(current).strip()
    if tail:
        parts.append(tail)
    return parts


def extract_imports(text: str) -> list[str]:
    return [m.group(0).rstrip() for m in IMPORT_RE.finditer(text)]


def import_source(stmt: str) -> str:
    m = re.search(r"from\s+['\"]([^'\"]+)['\"]", stmt)
    return m.group(1) if m else ""


def remove_return_block(body: str) -> str:
    idx = body.rfind("return {")
    if idx < 0:
        return body.strip()
    brace_open = body.index("{", idx)
    find_matching(body, brace_open, "{", "}")
    return body[:idx].rstrip()


def dedent_body(body: str) -> str:
    return textwrap.dedent(body).strip()


def unwrap_hook(ts: str) -> tuple[str, str, list[str], str]:
    m = re.search(r"export\s+(?:const\s+(\w+)\s*=\s*|function\s+(\w+)\s*)", ts)
    if not m:
        raise ValueError("export hook not found")
    hook_name = m.group(1) or m.group(2)
    idx = m.end()
    while idx < len(ts) and ts[idx] in " \t\n":
        idx += 1
    if ts[idx] != "(":
        raise ValueError("hook params not found")
    paren_close = find_matching(ts, idx, "(", ")")
    params_raw = ts[idx + 1 : paren_close]
    param_names = parse_param_names(params_raw)

    idx = paren_close + 1
    while idx < len(ts) and ts[idx] in " \t\n":
        idx += 1
    if ts.startswith("=>", idx):
        idx += 2
        while idx < len(ts) and ts[idx] in " \t\n":
            idx += 1
    if ts[idx] != "{":
        raise ValueError("hook body brace not found")
    close_brace = find_matching(ts, idx, "{", "}")
    body = remove_return_block(ts[idx + 1 : close_brace])

    preamble = ts[: m.start()].strip()
    preamble = re.sub(
        r"^export\s+(type|interface)\s+", r"\1 ", preamble, flags=re.MULTILINE
    )
    preamble = re.sub(
        r"^interface\s+\w+Callbacks\s*\{[\s\S]*?\}\n?",
        "",
        preamble,
        flags=re.MULTILINE,
    )
    preamble = re.sub(
        r"^type\s+Use\w+Options\s*=\s*\{[\s\S]*?\}\n?",
        "",
        preamble,
        flags=re.MULTILINE,
    )

    return preamble, hook_name, param_names, body


def parse_param_names(params_raw: str) -> list[str]:
    params_raw = params_raw.strip()
    if not params_raw:
        return []
    parts = split_top_level(params_raw)
    names: list[str] = []
    for part in parts:
        part = part.strip()
        if part.startswith("{"):
            inner = part[1 : part.rfind("}")]
            for item in split_top_level(inner):
                key = item.split(":")[0].strip()
                names.append(key)
        else:
            name = re.split(r"[:=]", part)[0].strip()
            if name.endswith("?"):
                name = name[:-1]
            if name:
                names.append(name)
    return names


def parse_vue_script(vue: str) -> tuple[str, str, str]:
    m = re.search(r"<script\s+setup[^>]*>([\s\S]*?)</script>", vue)
    if not m:
        raise ValueError("no script setup")
    return vue[: m.start(1)], m.group(1), vue[m.end(1) :]


def remove_use_list_imports(script: str) -> str:
    out: list[str] = []
    for line in script.splitlines():
        if "./use-list" in line:
            continue
        out.append(line)
    return "\n".join(out)


def find_hook_call(script: str, hook_name: str) -> tuple[int, int, str]:
    token = f"{hook_name}("
    idx = script.find(token)
    if idx < 0:
        raise ValueError(f"call to {hook_name} not found")
    start = script.rfind("const {", 0, idx)
    if start < 0:
        raise ValueError("destructure start not found")
    paren_open = idx + len(hook_name)
    paren_close = find_matching(script, paren_open, "(", ")")
    end = paren_close + 1
    while end < len(script) and script[end] in " \t":
        end += 1
    if end < len(script) and script[end] == ";":
        end += 1
    if end < len(script) and script[end] == "\n":
        end += 1
    args = script[paren_open + 1 : paren_close].strip()
    return start, end, args


def parse_object_literal_keys(obj_str: str) -> dict[str, str]:
    obj_str = obj_str.strip()
    if not obj_str.startswith("{"):
        return {}
    inner = obj_str[1 : obj_str.rfind("}")]
    entries = split_top_level(inner)
    result: dict[str, str] = {}
    for entry in entries:
        if ":" not in entry:
            continue
        key, val = entry.split(":", 1)
        result[key.strip()] = val.strip()
    return result


def apply_param_substitutions(
    body: str, param_names: list[str], args_str: str
) -> tuple[str, str]:
    if not param_names:
        return "", body

    args = split_top_level(args_str) if args_str.strip() else []
    prefix_parts: list[str] = []

    for i, pname in enumerate(param_names):
        if i >= len(args):
            break
        arg = args[i].strip()

        if arg.startswith("{") and pname in ("callbacks", "options"):
            mapping = parse_object_literal_keys(arg)
            for key, val in mapping.items():
                if val.startswith("(") or val.startswith("async"):
                    const_name = key
                    prefix_parts.append(f"const {const_name} = {val}")
                    body = re.sub(
                        rf"{re.escape(pname)}\.{re.escape(key)}\?\.\(",
                        f"{const_name}(",
                        body,
                    )
                    body = re.sub(
                        rf"{re.escape(pname)}\.{re.escape(key)}\(",
                        f"{const_name}(",
                        body,
                    )
                else:
                    body = re.sub(
                        rf"{re.escape(pname)}\.{re.escape(key)}\b",
                        val,
                        body,
                    )
        elif arg.startswith("{") and pname == "refs":
            mapping = parse_object_literal_keys(arg)
            for key in mapping:
                body = re.sub(rf"\brefs\.{re.escape(key)}\b", key, body)
        elif arg.startswith("{"):
            mapping = parse_object_literal_keys(arg)
            for key, val in mapping.items():
                body = re.sub(rf"\b{pname}\.{re.escape(key)}\b", val, body)
        else:
            body = re.sub(rf"\b{re.escape(pname)}\b", arg, body)

    prefix = "\n\n".join(prefix_parts)
    if prefix:
        prefix += "\n\n"
    return prefix, body


def parse_import_names(stmt: str) -> tuple[str, bool, list[str], str | None]:
    is_type = stmt.lstrip().startswith("import type")
    source = import_source(stmt)
    default_match = re.match(r"import\s+(\w+)\s+from\s+['\"]", stmt.lstrip())
    default_name = default_match.group(1) if default_match and "{" not in stmt.split("from")[0] else None
    brace = re.search(r"\{([\s\S]*?)\}", stmt)
    names: list[str] = []
    if brace:
        for part in split_top_level(brace.group(1)):
            token = part.strip()
            if token:
                names.append(token)
    return source, is_type, names, default_name


def format_merged_import(source: str, is_type: bool, names: list[str], default_name: str | None) -> str:
    kind = "import type" if is_type else "import"
    if default_name and names:
        return f"{kind} {default_name}, {{ {', '.join(names)} }} from '{source}'"
    if default_name:
        return f"import {default_name} from '{source}'"
    if not names:
        return ""
    return f"{kind} {{ {', '.join(names)} }} from '{source}'"


def merge_imports(script: str, preamble: str) -> str:
    merged: dict[tuple[str, bool], dict[str, object]] = {}
    default_imports: dict[str, str] = {}

    for stmt in extract_imports(script) + extract_imports(preamble):
        source, is_type, names, default_name = parse_import_names(stmt)
        key = (source, is_type)
        bucket = merged.setdefault(key, {"names": []})
        seen = {n.split(" as ")[-1].strip() for n in bucket["names"]}
        for name in names:
            alias = name.split(" as ")[-1].strip()
            if alias not in seen:
                bucket["names"].append(name)
                seen.add(alias)
        if default_name and source not in default_imports:
            default_imports[source] = default_name

    import_stmts: list[str] = []
    for (source, is_type), bucket in sorted(merged.items(), key=lambda x: x[0][0]):
        stmt = format_merged_import(
            source, is_type, bucket["names"], default_imports.get(source)
        )
        if stmt:
            import_stmts.append(stmt)

    # Remove all old import statements from script body.
    body = script
    for stmt in extract_imports(script):
        body = body.replace(stmt, "")
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    return ("\n".join(import_stmts) + "\n\n" + body).strip() + "\n"


def strip_duplicate_i18n(script: str, body: str) -> str:
    combined = script + "\n" + body
    needs_t = bool(re.search(r"\bt\(", combined)) or " t(" in combined or ", t," in combined
    needs_locale = "locale()" in combined or "locale," in combined or " locale " in combined
    has_i18n = "useUniI18n()" in script

    body = re.sub(
        r"^\s*const\s+\{[^}]+\}\s*=\s*useUniI18n\(\)\s*\n?",
        "",
        body,
        flags=re.MULTILINE,
    )

    if has_i18n:
        return body

    if needs_t and needs_locale:
        return "const { locale, t } = useUniI18n()\n" + body.lstrip()
    if needs_t:
        return "const { t } = useUniI18n()\n" + body.lstrip()
    if needs_locale:
        return "const { locale } = useUniI18n()\n" + body.lstrip()
    return body


def consolidate_i18n(script: str) -> str:
    if "useUniI18n" not in script:
        return script
    if re.search(r"const\s+\{[^}]+\}\s*=\s*useUniI18n\(\)", script):
        return script
    needs_t = bool(
        re.search(r"\bt\(", script)
        or re.search(r"const\s+tr\s*=\s*t\b", script)
        or re.search(r"\{\s*t\s*[,}]", script)
    )
    needs_locale = "locale()" in script
    if not needs_t and not needs_locale:
        return script

    cleaned = re.sub(
        r"^\s*const\s+\{[^}]+\}\s*=\s*useUniI18n\(\)\s*\n?",
        "",
        script,
        flags=re.MULTILINE,
    )
    if needs_t and needs_locale:
        hook = "const { locale, t } = useUniI18n()\n\n"
    elif needs_t:
        hook = "const { t } = useUniI18n()\n\n"
    else:
        hook = "const { locale } = useUniI18n()\n\n"

    imports = extract_imports(cleaned)
    if not imports:
        return hook + cleaned.strip() + "\n"

    last = imports[-1]
    idx = cleaned.rfind(last) + len(last)
    while idx < len(cleaned) and cleaned[idx] in " \t\n":
        idx += 1
    return cleaned[:idx] + "\n\n" + hook + cleaned[idx:].lstrip()


def preamble_non_imports(preamble: str) -> str:
    text = preamble
    for stmt in extract_imports(preamble):
        text = text.replace(stmt, "")
    return "\n".join(line for line in text.splitlines() if line.strip()).strip()


def process_pair(use_list: Path) -> None:
    vue = use_list.parent / "list.vue"
    if not vue.exists():
        print(f"SKIP no list.vue: {use_list}")
        return

    ts = use_list.read_text(encoding="utf-8")
    preamble, hook_name, param_names, hook_body = unwrap_hook(ts)
    vue_text = vue.read_text(encoding="utf-8")
    pre, script, post = parse_vue_script(vue_text)

    call_start, call_end, args_str = find_hook_call(script, hook_name)
    before_call = script[:call_start].rstrip()
    after_call = script[call_end:].lstrip("\n")

    prefix, hook_body = apply_param_substitutions(hook_body, param_names, args_str)
    hook_body = dedent_body(hook_body)
    hook_body = strip_duplicate_i18n(before_call + after_call, hook_body)

    before_call = remove_use_list_imports(before_call)
    before_call = merge_imports(before_call, preamble)

    pre_rest = preamble_non_imports(preamble)
    parts: list[str] = []
    if pre_rest:
        parts.append(pre_rest)
    if prefix.strip():
        parts.append(prefix.rstrip())
    parts.append(hook_body)
    logic_block = "\n\n".join(parts)

    script = f"{before_call}\n\n{logic_block}\n\n{after_call}".rstrip() + "\n"
    script = consolidate_i18n(script)

    vue.write_text(pre + script + post, encoding="utf-8")
    use_list.unlink()
    print(f"OK {use_list.relative_to(ROOT)}")


def main() -> None:
    files = sorted({str(p.resolve()): p for p in VIEWS.rglob("use-list.ts")}.values())
    for f in files:
        try:
            process_pair(f)
        except Exception as e:
            print(f"FAIL {f.relative_to(ROOT)}: {e}")


if __name__ == "__main__":
    main()
