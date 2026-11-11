"""src/page.html 을 배포용 파일로 나눈다.

- assets/css/style.css  페이지 스타일
- assets/js/app.js      페이지 스크립트
- index.html            마크업, 위 두 파일을 불러온다

사용법: python scripts/build_page.py
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "page.html"

RESET_CSS = """/* 배포용 기본 리셋 */
:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; }
img { max-width: 100%; }
[hidden] { display: none !important; }

"""


def main() -> None:
    html = SRC.read_text(encoding="utf-8")

    style = re.search(r"<style>\n?(.*?)</style>\n?", html, re.S)
    script = re.search(r"<script>\n?(.*?)</script>\n?", html, re.S)
    if not style or not script:
        sys.exit("src/page.html 에서 <style> 또는 <script> 블록을 찾지 못했습니다")

    css = RESET_CSS + style.group(1).strip() + "\n"
    js = script.group(1).strip() + "\n"

    rest = html
    for m in sorted([style, script], key=lambda m: m.start(), reverse=True):
        rest = rest[: m.start()] + rest[m.end():]

    marker = '<header class="topbar">'
    i = rest.index(marker)
    head = rest[:i].strip()
    body = rest[i:].strip()

    doc = "\n".join([
        "<!doctype html>",
        '<html lang="ko">',
        "<head>",
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
        head,
        '<link rel="stylesheet" href="assets/css/style.css">',
        "</head>",
        "<body>",
        body,
        '<script src="assets/js/app.js"></script>',
        "</body>",
        "</html>",
        "",
    ])

    (ROOT / "assets" / "css").mkdir(parents=True, exist_ok=True)
    (ROOT / "assets" / "js").mkdir(parents=True, exist_ok=True)
    (ROOT / "assets" / "css" / "style.css").write_text(css, encoding="utf-8")
    (ROOT / "assets" / "js" / "app.js").write_text(js, encoding="utf-8")
    (ROOT / "index.html").write_text(doc, encoding="utf-8")
    print("index.html, assets/css/style.css, assets/js/app.js 생성 완료")


if __name__ == "__main__":
    main()
