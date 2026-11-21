# noahlahaise.com

Personal portfolio of Noah LaHaise — software developer building production AI systems and enterprise warehouse software in the Microsoft D365 ecosystem.

Static HTML/CSS/JS, no build step, no frameworks. Hosted on GitHub Pages (see `CNAME` and `HOSTING_GUIDE.md`).

## Design

Night plate: near-black ground with ultramarine/periwinkle light. Schibsted Grotesk for headings and prose, DM Mono for metadata. Each page opens on a full-bleed "plate": a Greek temple raymarched in WebGL and Bayer-dithered to a night ramp (page black → ultramarine → pale haze), animating very slowly (drifting fog, a ~100 s light cycle). Copy stays factual — roles, stacks, dates — no taglines.

## Structure

```
├── index.html       # Home — hero plate, profile sheet, selected work index
├── projects.html    # Project write-ups (anchors: #sharepoint-rag, #stock-mcp, …)
├── resume.html      # Experience, education, skills
├── contact.html     # Email, LinkedIn, GitHub
├── css/style.css    # Design tokens and all page styles
└── js/
    ├── parthenon.js # The dithered temple plate (WebGL raymarcher)
    └── main.js      # Footer dither + header clock
```

## Editing

- **Colours / type:** CSS variables at the top of `css/style.css`.
- **Projects:** add an `<article class="project">` to `projects.html`, and a row to the `ol.index` list in `index.html` linking to its anchor.
- **Plates:** any `<canvas data-parthenon>` inside a `.plate` renders the temple. Camera and sphere are set per canvas with `data-yaw`, `data-dist`, `data-ty`, `data-cy`, `data-pan`, `data-moon` and `data-t0` — documented at the top of `js/parthenon.js`. Use `.plate.band` for the shorter subpage height. The palette lives in `ramp()` inside the shader.

## Local preview

Open `index.html` in a browser, or serve the folder (`python -m http.server`) and visit `http://localhost:8000`.

When changing the shader, test in a real GPU-backed browser: undefined GLSL (reversed `smoothstep` edges, `pow` of a negative base) renders fine in software renderers but breaks on Direct3D/ANGLE.
