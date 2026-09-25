# DexHoldem — Anonymous ICLR Supplement

Static review website retaining the research description, figures, results,
interactive perception examples, 14 dataset camera triplets, and 36 policy videos.
No build dependencies are required.

Author names and profiles, author contributions, named citation, public project
and dataset links, social links, and identifying dataset metadata are excluded.
The paper PDF, full agent/teleoperation demos, and one-minute video are deliberately
omitted. All browser resources are local; search indexing is discouraged through
robots directives. These directives are not access control.

Identifying image and video metadata have been stripped. Visible faces in the
experiment images and dataset camera previews are covered with opaque masks;
the corresponding video posters are regenerated from the masked footage.
Video dimensions, frame rates, and frame counts are retained. The original
source repository is untouched. Face masking is best effort and still merits
human review before submission.

## Local preview

```sh
python scripts/check_site.py
python scripts/build_site.py
python -m http.server 8765 --bind 127.0.0.1 --directory .site
```

Open http://127.0.0.1:8765/. The build stages only website files, excluding Git
history, scripts, README, and local audit artifacts. Use a fresh checkout for each
build. `.review/` is private local QA material and must not be published.

## GitHub Pages

In repository Settings → Pages, select **GitHub Actions** as the source. The
included workflow validates and deploys the site on pushes to `main`, or through
its manual trigger. The expected URL for this repository is
https://dexholdempage.github.io/DexHoldem/ (available only after deployment).

Do not merge the original site's Git history into this repository. Future commits
and the hosting account should not reveal author identity. The existing project
name and scientific content are retained as requested, so this is not a guarantee
against matching the work to publicly available material.

## Updating review material

Keep assets local and strip identifying metadata before adding them. Validate
links with `python scripts/check_site.py` after edits. This checks local links,
anchors, dataset previews, excluded files, and external URLs, but does not replace
visual inspection of pictures and videos for faces, logos, or embedded text.
