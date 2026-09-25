"""Stage only public website files; never publish repository or audit files."""
from pathlib import Path
import shutil
from check_site import check, ROOT

check()
output = ROOT / ".site"
if output.exists():
    raise SystemExit(".site already exists; use a fresh checkout for a clean build.")
output.mkdir()
for name in ["index.html", "styles.css", "script.js", "layout.js", "dataset-videos.js", "robots.txt", ".nojekyll", "LICENSE", "pages", "assets"]:
    source = ROOT / name
    if source.is_dir():
        shutil.copytree(source, output / name)
    else:
        shutil.copy2(source, output / name)
print(f"Static site staged in {output}")
