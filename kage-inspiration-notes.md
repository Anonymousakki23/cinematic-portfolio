# Kage (threeui.com) design breakdown — for dark-tech inspired rebuild
Source: browser design analysis 2026-10-06. KageLandingPage (MIT, @designcodeio/threeui)
is a full-page temple experience in a sandboxed iframe — NOT reusable elements.
Verdict given to user: rebuild the experience pattern natively, dark tech.

## The wow element (what to recreate)
- Persistent living diorama: ONE pinned full-viewport WebGL scene the user scrolls THROUGH.
  Sections are staged lighting/camera changes within it, never leaving the 3D world.
- Scroll-driven camera (canvas is pointer-events:none; no mouse-reactive 3D, all scroll).
- Per-chapter foreground silhouette cutouts rise from bottom with parallax drift
  (paper-theater flats over the 3D scene).
- Chapter cards embed their OWN live mini WebGL viewports (scissored render targets)
  with "LIVE" badge + blinking dot.

## Atmosphere
- Near-black blue-green bg (#04070a → #0a1116), exponential mist/fog, drifting ember/firefly particles.
- Film-grain overlay (SVG fractal noise, ~5.5%, overlay blend), global vignette.
- Key light: one large vermilion moon low + warm amber point lights (lanterns).

## Motion / micro-interactions
- Masked line reveals: 3-line hero, overflow-hidden masks, translateY(110%)→0 staggered.
- Custom cursor: 22px difference-blend ring lerps after pointer; expands to 88px
  blurred-glass circle with mono label (VIEW/ENTER/PLAY) over interactive targets.
- Nav link labels roll vertically on hover (duplicated label slides up).
- Cards: hover lift + border glow + corner arrow appears.
- Lesson rows: underline sweeps L→R, row shifts +10px, faint wash fills behind.
- Preloader: fullscreen dark, rising moon, thin progress line + mono % + cycling
  chapter names; splash lifts away translateY(-100%).
- Scroll progress: right-edge dot rail (6 stops) with hover labels; active dot accent.
- Fixed glass nav: hides on scroll-down, returns on scroll-up.

## Typography
- Headlines: Fraunces serif light (~340), sentence case, tight leading.
- Body: Inter 15–17px muted. Mono accents: Space Mono 10–12px uppercase, ls .14–.22em.
- Giant index numerals as 1px stroked outline type; vertical-rl side text.

## Dark-tech translation plan (for Akshay's portfolio)
- Replace temple diorama with dark-tech 3D world: wireframe data-city / particle
  nebula / glowing grid corridor in sci-cyan (#00FFFF) + purple (#7B61FF) + magenta.
- Chapters: Data / Training / Photography as pinned scenes; photos as holographic panels.
- Foreground silhouettes → HUD parallax layers (scanlines, corner brackets, mono labels).
- Keep: scroll-driven camera, fog+particles, grain+vignette, masked reveals,
  custom cursor ring, dot rail progress, glass nav hide/show, preloader with %.
- Type: keep Orbitron display + mono-sci accents (already in use).
