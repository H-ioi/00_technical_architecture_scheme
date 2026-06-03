# -*- coding: utf-8 -*-
"""Fix common issues after use-list merge."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = ROOT / "src" / "views"


def dedupe_adjacent_imports(text: str) -> str:
    lines = text.splitlines()
    out: list[str] = []
    prev_import: str | None = None
    for line in lines:
        s = line.strip()
        if s.startswith("import ") and s == prev_import:
            continue
        out.append(line)
        prev_import = s if s.startswith("import ") else None
    return "\n".join(out)


def strip_orphan_preamble_types(script: str) -> str:
    script = re.sub(
        r"^type DialogRef = \{ value: InstanceType<typeof FormDialog>.*\}\n",
        "",
        script,
        flags=re.MULTILINE,
    )
    script = re.sub(
        r"^interface DialogRefs \{\s*formDlg:.*\}\n",
        "",
        script,
        flags=re.MULTILINE,
    )
    script = re.sub(
        r"^import type \w+ from ['\"]\./components/form-dialog\.vue['\"]\s*\n",
        "",
        script,
        flags=re.MULTILINE,
    )
    return script


def fix_refs_in_questionnaire(script: str) -> str:
    return script.replace("refs.metaDlg", "metaDlg").replace("refs.copyDlg", "copyDlg")


def fix_duplicate_router(script: str) -> str:
    count = len(re.findall(r"const router = useRouter\(\)", script))
    if count <= 1:
        return script
    first = True
    out: list[str] = []
    for line in script.splitlines():
        if "const router = useRouter()" in line:
            if first:
                out.append(line)
                first = False
            continue
        if "const route = useRoute()" in line and "const route = useRoute()" in "\n".join(out):
            continue
        out.append(line)
    return "\n".join(out)


def fix_i18n_locale_only(script: str) -> str:
    if re.search(r"const\s+tr\s*=\s*t\b", script) and re.search(
        r"const\s+\{\s*locale\s*\}\s*=\s*useUniI18n\(\)", script
    ):
        script = re.sub(
            r"const\s+\{\s*locale\s*\}\s*=\s*useUniI18n\(\)",
            "const { locale, t } = useUniI18n()",
            script,
            count=1,
        )
    if re.search(r"\bt\(", script) and not re.search(
        r"const\s+\{[^}]*\bt\b[^}]*\}\s*=\s*useUniI18n\(\)", script
    ):
        if "useUniI18n" in script:
            imports = list(
                re.finditer(
                    r"import\s+(?:type\s+)?[\s\S]*?from\s+['\"][^'\"]+['\"]",
                    script,
                )
            )
            if imports:
                idx = imports[-1].end()
                while idx < len(script) and script[idx] in " \t\n":
                    idx += 1
                script = script[:idx] + "\n\nconst { t } = useUniI18n()\n\n" + script[idx:].lstrip()
    return script


def fix_apply_open_detail(script: str) -> str:
    if "openDetail" not in script or "const openDetail" in script:
        return script
    insert = """
const openDetail = (row: BusOrderRecord) => {
  detailOrderId.value = row.id ?? null
  detailVisible.value = true
}
""".strip()
    return script.replace(
        "const closeDetail = () => {",
        insert + "\n\nconst closeDetail = () => {",
        1,
    )


def omit_unused_total(script: str) -> str:
    return re.sub(
        r"tableRef,\s*total,\s*search",
        "tableRef, search",
        script,
    )


def cleanup_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"<script\s+setup[^>]*>([\s\S]*?)</script>", text)
    if not m:
        return False
    script = m.group(1)
    orig = script
    script = dedupe_adjacent_imports(script)
    script = strip_orphan_preamble_types(script)
    if "questionnaire" in str(path):
        script = fix_refs_in_questionnaire(script)
    if "program" in str(path):
        script = fix_duplicate_router(script)
    script = fix_i18n_locale_only(script)
    if "student/apply" in str(path).replace("\\", "/"):
        script = fix_apply_open_detail(script)
    script = omit_unused_total(script)
    if script == orig:
        return False
    text = text[: m.start(1)] + script + text[m.end(1) :]
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    for vue in sorted(VIEWS.rglob("list.vue")):
        if cleanup_file(vue):
            print(f"cleaned {vue.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
