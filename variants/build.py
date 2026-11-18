"""Build the three look-alike versions of the site: a/, b/ and c/.

Each version is index.html with a different theme layered on top, so the words,
run sheet, guest list and RSVP form are always identical to the main site.

    python3 variants/build.py

Run it after any change to index.html, then commit the a/, b/ and c/ folders.
To change how a version looks, edit its .css (and, for c, c.js) in this folder.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HERE = ROOT / "variants"

VERSIONS = {
    "a": "Daylight",
    "b": "Cinema",
    "c": "Lights",
}

BASE_FONT = (
    '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400'
    '&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">'
)


def replace_once(text: str, old: str, new: str) -> str:
    if text.count(old) != 1:
        raise SystemExit(f"Expected exactly one {old[:60]!r} in index.html, found {text.count(old)}")
    return text.replace(old, new)


def build(key: str, name: str, base: str) -> str:
    html = replace_once(base, BASE_FONT, (HERE / f"{key}.font.html").read_text().strip())
    theme = (HERE / f"{key}.css").read_text().rstrip()
    html = replace_once(html, "\n</style>", f"\n\n{theme}\n</style>")
    html = replace_once(
        html,
        "<body>\n",
        f"<body>\n<!-- Version {key.upper()}: {name}. Built from index.html by variants/build.py; edit those, not this file. -->\n",
    )
    script = HERE / f"{key}.js"
    if script.exists():
        html = replace_once(html, "<body>\n", '<body>\n<canvas id="lights" aria-hidden="true"></canvas>\n')
        html = replace_once(html, "\n</body>", f"\n<script>\n{script.read_text().rstrip()}\n</script>\n</body>")
    return html


def main() -> None:
    base = (ROOT / "index.html").read_text()
    for key, name in VERSIONS.items():
        out = ROOT / key / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(build(key, name, base))
        print(f"{key}/index.html  ({name})")


if __name__ == "__main__":
    main()
