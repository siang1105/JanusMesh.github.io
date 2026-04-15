# JanusMesh (project page)

GitHub Pages site for **JanusMesh: Fast and Zero-Shot 3D Visual Illusion Generation via Cross-Space Denoising**.

Live site: publish this repository as a GitHub Pages project (e.g. `https://<user>.github.io/JanusMesh.github.io/`).

## Local preview

From the repository root:

```bash
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/` (use a free port if 8765 is taken).

## Repository layout

| Path | Purpose |
|------|---------|
| `index.html` | Main project page: hero video slot, teaser & pipeline figures, abstract, method blurb, results grid with pagination, links to gallery |
| `gallery.html` | Compact gallery landing with links to category viewers |
| `pages/` | Full-screen video browsers: `2-object-clip.html`, `2-object-fix.html`, `3-object.html` |
| `static/images/` | `teaser.png`, `pipeline.png`, `favicon.svg` |
| `static/result/` | Supplementary MP4s (mirrors ECCV supplementary layout) |
| `static/css/`, `static/js/` | Styles and scripts (`gifs.js` holds per-category file lists) |

Replace **Paper** / **Code** URLs in `index.html` when they are public.

## Updating figures and video

- **Teaser / pipeline:** overwrite `static/images/teaser.png` and `static/images/pipeline.png`.
- **Top hero video:** add a `<source>` inside `#main-teaser-video` in `index.html` when the file is ready.
- **Results / gallery videos:** add or rename MP4s under `static/result/…` and update lists in `static/js/gifs.js` if filenames change.

## Credits and license

Page layout derives from the [Nerfies](https://github.com/nerfies/nerfies.github.io) project-page template (Bulma was trimmed over time; gallery uses a small standalone stylesheet).

This website is licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
