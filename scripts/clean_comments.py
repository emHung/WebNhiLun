"""Remove ordinary Python/CSS/HTML comments without changing executable tokens."""
import io
import json
import re
import subprocess
import tokenize
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KEEP = re.compile(r"copyright|license|@license|@preserve|noqa|type:\s*ignore|coding[:=]|^#!|fmt:|ruff:|eslint|prettier|sourceMappingURL|\[if\s", re.I)


def clean(path, source):
    ranges = []
    if path.suffix == ".py":
        lines = source.splitlines(keepends=True)
        offsets, pos = [], 0
        for line in lines:
            offsets.append(pos)
            pos += len(line)
        for token in tokenize.generate_tokens(io.StringIO(source).readline):
            if token.type == tokenize.COMMENT and not KEEP.search(token.string):
                ranges.append((offsets[token.start[0] - 1] + token.start[1], offsets[token.end[0] - 1] + token.end[1]))
    elif path.suffix == ".css":
        pattern = r"'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\"|/\*[\s\S]*?\*/"
        for match in re.finditer(pattern, source):
            if match[0].startswith("/*") and not KEEP.search(match[0]):
                ranges.append(match.span())
    elif path.suffix in {".html", ".htm"}:
        from html.parser import HTMLParser

        offsets, pos = [], 0
        for line in source.splitlines(keepends=True):
            offsets.append(pos)
            pos += len(line)

        class Comments(HTMLParser):
            def handle_comment(self, data):
                start = offsets[self.getpos()[0] - 1] + self.getpos()[1]
                end = source.find("-->", start) + 3
                if end >= start + 7 and not KEEP.search(data):
                    ranges.append((start, end))

        Comments(convert_charrefs=False).feed(source)
    for start, end in reversed(ranges):
        source = source[:start] + re.sub(r"[^\r\n]", " ", source[start:end]) + source[end:]
    touched = set()
    for start, end in ranges:
        touched.update(range(source.count("\n", 0, start), source.count("\n", 0, end) + 1))
    source = "\n".join(re.sub(r"[ \t]+(?=\r?$)", "", line) if index in touched else line for index, line in enumerate(source.split("\n")))
    return source, len(ranges)


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    names = subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], cwd=ROOT).decode().split("\0")
    changes = []
    for name in sorted(set(names)):
        path = ROOT / name
        if not name or not path.is_file() or path.suffix not in {".py", ".css", ".html", ".htm"}:
            continue
        if name.startswith(("graft/", "supabase/migrations/")):
            continue
        source = path.read_bytes().decode("utf-8-sig")
        result, count = clean(path, source)
        if count:
            if path.suffix == ".py":
                before = [(t.type, t.string) for t in tokenize.generate_tokens(io.StringIO(source).readline) if t.type != tokenize.COMMENT]
                after = [(t.type, t.string) for t in tokenize.generate_tokens(io.StringIO(result).readline) if t.type != tokenize.COMMENT]
                if before != after:
                    raise RuntimeError(f"Executable tokens changed: {name}")
            changes.append({"file": name, "removed": count})
            if args.apply:
                path.write_bytes(result.encode("utf-8"))
    print(json.dumps({"mode": "apply" if args.apply else "dry-run", "changes": changes}, ensure_ascii=False))


if __name__ == "__main__":
    main()
