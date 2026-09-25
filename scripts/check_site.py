"""Check the review site's links, assets, and anonymous publishing boundary."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", *sorted((ROOT / "pages").glob("*.html"))]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.meta = path, set(), [], {}
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("http-equiv", ""))] = attrs.get("content", "")
        assert tag != "iframe", f"External embed: {self.path}"
        for key in ("href", "src", "poster"):
            if key in attrs:
                self.refs.append(attrs[key])


def check():
    pages = {p.resolve(): Page(p) for p in PAGES}
    refs = 0
    for path, page in pages.items():
        assert "noindex" in page.meta.get("robots", ""), path
        assert page.meta.get("referrer") == "no-referrer", path
        assert "frame-src 'none'" in page.meta.get("Content-Security-Policy", ""), path
        for ref in page.refs:
            url = urlsplit(ref)
            assert not url.scheme and not url.netloc, f"Non-local URL: {path}: {ref}"
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            assert target.is_relative_to(ROOT), f"Escaping path: {ref}"
            assert target.is_file(), f"Missing file: {path.name}: {ref}"
            if url.fragment and target in pages:
                assert unquote(url.fragment) in pages[target].ids, f"Missing anchor: {ref}"
            refs += 1
    for path in [*PAGES, *ROOT.glob("*.js"), ROOT / "styles.css"]:
        text = path.read_text(encoding="utf-8")
        assert not re.search(r"https?://|mailto:|data-(?:youtube|bilibili)-src", text), f"External reference: {path}"
    assert "Anonymous Authors" in (ROOT / "index.html").read_text(encoding="utf-8")
    for name in ["assets/papers", "assets/data", "pages/authors.html", "pages/demos.html", "assets/videos/one-minute-demo.mp4"]:
        assert not (ROOT / name).exists(), f"Excluded material present: {name}"
    tasks = re.findall(r'task: "([^"]+)"', (ROOT / "dataset-videos.js").read_text(encoding="utf-8"))
    assert len(tasks) == 14
    for task in tasks:
        for camera in range(3):
            for filename in [f"cam{camera}.mp4", f"poster_cam{camera}.jpg"]:
                assert (ROOT / "assets/videos/dataset-samples" / task / filename).is_file(), filename
    policy = (ROOT / "script.js").read_text(encoding="utf-8")
    for ref in re.findall(r'"(assets/videos/[^"`]+)"', policy):
        assert (ROOT / ref).is_file(), ref
    for ref in re.findall(r'url\([\"\']?([^\)\"\']+)', (ROOT / "styles.css").read_text(encoding="utf-8")):
        assert (ROOT / ref).is_file(), ref
    print(f"PASS: {len(pages)} pages, {refs} local references, 14 camera triplets; no external page/script/style URLs.")


if __name__ == "__main__":
    check()
