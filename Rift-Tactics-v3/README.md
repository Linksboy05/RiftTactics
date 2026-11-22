# Rift Tactics — Team War Room (v3)

Responsive, fan-made **Marvel Rivals** team draft, hero reference and tactical map planner. Built with plain **HTML, CSS and JavaScript**; works in VS Code, Live Server and GitHub Pages. No npm build, backend or account required.

## Getting started

1. Extract the entire ZIP folder, not just `index.html`.
2. Open the extracted folder in **Visual Studio Code**.
3. Start **Live Server** on `index.html`. For basic use, double-clicking `index.html` in a browser also works; Live Server is recommended.
4. When publishing, upload the **entire** folder contents to a GitHub Pages repository, keeping `assets/maps/...` paths intact.
5. All 24 supplied map overheads are already installed locally; **you do not need to upload map images individually**.

## Your `Rival_Maps.zip` is integrated

Your supplied ZIP contained **24 WebP files**, not PNGs. WebP is supported in current Chrome, Edge, Firefox and Safari. Original images are included in `assets/maps/`, arranged by mode and arena:

- **Convergence — 5 layouts**: Central Park, Hall of Djalia, Heart of Heaven, Shin-Shibuya, Symbiotic Surface.
- **Convoy — 5 layouts**: Arakko, Midtown, Spider-Islands, Thebes, Yggdrasill Path.
- **Domination — 14 individual objective layouts** across Birnin T'challa (3), Celestial Husk (3), God Quarry (3), Hell's Heaven (2), and Krakoa (3).
- **Practice Arena — 1 generated layout** that is not a game-accurate map.

Choose **game mode → exact battlefield/point**. When you change maps, each one retains its own tokens, pen strokes, arrows, circles, notes and phase in that browser. Actual overheads display at their own aspect ratio, including tall Domination point captures.

## Draft formats

- **MRC / Tournament Basic** — fixed 10-step bans/protections.
- **Ignite / Tournament Advanced** — fixed sequence with opponent-only restrictions, intended as a coaching approximation; refer to the specific event rulebook.
- **Ranked / Lineup Planner** — **no bans or hero protections** in this app, as requested. Instead select up to six heroes for Alpha and Omega; mirror compositions are permitted. This is an opt-in planning behavior and **does not represent the in-game Ranked ban rules**, which vary by rank and season.
- **Freeform** — manually assign bans/protections for practice.

Click the small **i** on any draft portrait to open the ability reference without selecting that hero.

## Heroes, portraits and ability details

- All **55 current Season 11 heroes** have an individually mapped default-avatar photo URL, role and original one-sentence tactical profile.
- Portraits load from a **third-party image host, `cdn.source.gs`**, with visible initial fallbacks. **The portrait images are not embedded in the ZIP and require an internet connection**. This can also be affected by the image provider's availability or browser security policies.
- Every hero has **curated, independently worded summaries for at least one signature ability**, and almost all have two or more. These are not verbatim copies of the official website and are not claimed to be exhaustive. For **every hero**, the profile has **Official Hero Gallery** and **Full Abilities & Cooldowns** links to detailed sources; see `data.js` for extending the local profiles.
- On the strategy board, hero portraits are used in the marker palette and *attempted* inside canvas tokens. For safe Discord exports, if the remote host does not allow anonymous CORS loading, tokens fall back to **readable initials** instead of breaking the entire PNG/JPEG.
- Sources: [Official Marvel Rivals hero gallery](https://www.marvelrivals.com/heroes/) and [rivals.gs hero reference](https://rivals.gs/heroes/). Verify gameplay specifics in the current game build.

## Strategy board and mobile

- Touch-usable **Move, Draw, Arrow, Area, Erase**, ally/enemy hero markers, notes, undo and zoom. Draw or drag using a finger on mobile.
- **Standard PNG or JPEG image export** supports Discord. Export is disabled while map artwork loads so the download includes the selected map. A JPG image is genuinely encoded as JPEG, not just renamed. Actual file size depends on map complexity and export resolution.
- Responsive navigation (hamburger), draft card grid, hero gallery, and a stacked strategy board on narrow screens.
- Mobile pinch-to-zoom is **not currently implemented**: use the **+ / −** board zoom buttons.
- Data is browser/device-local only and autosaves in that browser; only strategy-board images can be exported for sharing. No cross-device sync, workspace backup, real-time collaboration, account system or server storage yet.

## Project layout

- `index.html` – all sections and controls.
- `styles.css` – responsive styles.
- `data.js` – 55-hero roster, portrait links, roles, map library and draft configurations.
- `app.js` – UI state, draft logic, canvas tools, storage and image export.
- `assets/maps/` – all 24 user-supplied WebP layouts.

## Attribution and sharing

Fan-made project; not affiliated with Marvel, NetEase, Disney, or the relevant tournaments. The map artwork is supplied by the project owner; **you are responsible for confirming redistribution rights** before making the website or the images public. Hero art rights remain with their owners; linking to a third-party image host does not transfer a license. Make sure hosted art may be used as intended before public launch.
