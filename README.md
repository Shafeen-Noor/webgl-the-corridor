# dreamcore — surreal memory

A scroll-driven WebGL experience: scrolling moves a camera through five surreal rooms, each with its own custom GLSL shader. Built with Three.js and Vite, no UI framework.

**Live demo:** _add your deployed URL here (e.g. Vercel)_

<!-- Add a screenshot or short GIF: ![dreamcore](docs/preview.gif) -->

## The five scenes

| # | Scene | What it shows |
|---|-------|---------------|
| 1 | The Corridor | An endless hallway with animated "dream" walls and drifting dust particles |
| 2 | Floating Room | Chairs and a table drifting in a gentle sine-wave motion |
| 3 | The Mirror | Warp shader panels and cubes orbiting a swaying frame |
| 4 | VHS | A TV with a screen shader, floating cassettes, glitch intensity that grows as you scroll, plus a CSS scanline overlay |
| 5 | The Pool | A water shader that reveals itself as you reach the end of the scroll |

## Tech

- **Three.js** for the scene, camera, lights and fog
- **Custom GLSL shaders** (dream walls, warp, VHS glitch, TV screen, water) written as `ShaderMaterial`s
- **Vite** for dev server and build
- Plain CSS for the title overlays, progress dots, scanlines and film grain

## Run locally

```bash
npm install
npm run dev      # development server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## How it works

- `src/App/index.js` owns the animation loop. Scroll position (0–1) is smoothed with a lerp and drives both the camera and shader uniforms such as `uProgress` and `uIntensity`.
- `src/App/Camera/` moves between one waypoint per scene using smoothstep easing, with a small mouse-parallax offset.
- `src/App/Scenes/` has one factory function per scene; `src/App/Shaders/` has the materials.
- `src/App/UI/` toggles the scene titles, progress dots and the VHS overlay when the active scene changes.

## Accessibility and robustness

- **Reduced motion:** when the OS setting `prefers-reduced-motion` is on, ambient animation, VHS glitch, particle drift and mouse parallax are switched off, and the CSS grain, scroll-hint and title transitions are simplified. Scrolling still moves the camera, because the user controls it.
- **No WebGL:** if the renderer fails to start, a readable message is shown instead of a blank page. A `<noscript>` message covers disabled JavaScript.
- The canvas has a text alternative (`role="img"` and `aria-label`), and purely decorative overlays are hidden from assistive technology.
- Pixel ratio is capped at 1.5 to limit GPU cost on high-density screens.

## Testing notes

Checked so far:

- [x] Production build succeeds (bundle about 540 kB, about 136 kB gzipped)

To check before sharing (fill in your own results):

- [ ] Frame rate on a mid-range phone and on a laptop with integrated graphics
- [ ] Chrome, Firefox and Safari
- [ ] Window resize and device rotation
- [ ] `prefers-reduced-motion` on and off (DevTools → Rendering → Emulate CSS media feature)
- [ ] Lighthouse accessibility score

## Known issues

- Some procedural animation (dust drift, cassette spin, debris sway) is applied per frame rather than per second, so it runs faster on 120/144 Hz displays than on 60 Hz. Fix: multiply those increments by the frame delta.
- The first load pulls Google Fonts over the network; the page falls back to system fonts if blocked.
- The JS bundle is above Vite's 500 kB warning threshold; Three.js is most of it. Importing only the modules used would reduce it.
