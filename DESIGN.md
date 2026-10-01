# DESIGN SYSTEM: BOULEVARD — PERSONAL RECORD COLLECTION

**Document:** `DESIGN.md`  
**Classification:** Personal Music Collection & Tactile Digital Object  
**North Star:** A physical, warm, intimate space created by someone who deeply loves these songs. Inspired by independent cinema publications (A24), analog record collections, and tactile editorial typography.

---

## 1. Visual Theme & Atmosphere

- **Atmosphere:** Warm, tactile, human, quiet, cinematic, and personal.
- **The Core Emotion:** Entering someone's personal room where favorite records are kept on a sunlit table or shelf.
- **Anti-Slop Directives:**
  - Zero fake corporate/institutional terminology (no "Accession", "Ledger", "Curatorial Inscription", "48kHz", "Artifact").
  - Human, honest phrasing: "My Songs", "03 songs", "Listen Now", "Pause Record", "Now Playing".
  - Warm paper foundation (`#f5f4ef`) with deep charcoal ink (`#141518`) and subtle analog paper texture (`paper-grain`).
  - Physical record discs treated as tactile objects that slide out from their sleeves, spin at 33⅓ RPM when playing, and respond to touch.

---

## 2. Color Palette & Semantic Roles

| Token | Name | Value | Role |
| :--- | :--- | :--- | :--- |
| `--color-paper` | Warm Linen Paper | `#f5f4ef` | Primary page canvas |
| `--color-paper-subtle` | Soft Vellum | `#eae8e1` | Elevated surfaces, disc trays, tracklist backdrop |
| `--color-line` | Hairline Rule | `rgba(20, 21, 24, 0.10)` | Structural editorial rules |
| `--color-line-focus` | Lit Rule | `rgba(20, 21, 24, 0.25)` | Hover & active states |
| `--color-ink` | Deep Charcoal Ink | `#141518` | Primary headlines, song titles, active tracks |
| `--color-ink-secondary` | Muted Umber | `#5c5f66` | Artist names, descriptions, metadata |
| `--color-ink-tertiary` | Soft Ash | `#8c9099` | Track numbers, durations |

### Dynamic Artwork Color System
- Runtime color sampler (`src/utils/colorExtractor.ts`) samples the active artwork offscreen and derives a soft, cinematic background diffusion tint:
  - **01 / Boulevard of Broken Dreams (Green Day):** Muted Slate Blue
  - **02 / The Reason (Hoobastank):** Soft Terracotta & Cyan
  - **03 / Fire on Fire (Luke & Hasley):** Sunlit Amber & Sepia
- The page canvas, ambient glow, and player harmonize smoothly with a 1000ms easing transition between tracks.

---

## 3. Typography Hierarchy

- **Display Serif (`--font-display`):** `Instrument Serif`, `Georgia`, serif
  - Upright Roman, natural letterforms, slightly condensed line-height (`1.05`).
  - Applied to song titles, main headings, and lyric quotes.
- **Interface Sans (`--font-sans`):** `Plus Jakarta Sans`, `-apple-system`, sans-serif
  - Clean, humanist, highly readable.
  - Used for artist names, personal curator notes, and controls.
- **Subtle Mono (`--font-mono`):** `JetBrains Mono`, monospace
  - Reserved for small technical bits: track indices (`01`, `02`, `03`), live timestamps (`01:24 / 04:47`).

**Typography Usage Rules:**
- Display serif for headlines and song titles.
- Sans for body copy and interactive labels.
- Mono strictly for numeric indices and timestamps.
- Preserves natural casing: no excessive uppercase or robotic acronyms.

---

## 4. Components & Physical Interaction

1. **Art-Directed Asymmetric Hero (`HeroShelf.tsx`):**
   - Left: The physical album jacket with subtle paper sheen, side label, and an authentic vinyl record disc that emerges and rotates at 33⅓ RPM while playing.
   - Right: Track index, editorial title, artist, poetic lyric quote, and personal curator's reflection note.
   - Primary actions: "Listen Now" / "Pause Record" and "View Artwork".
   - Horizon navigation: Next / Previous buttons to flip between records.
2. **Artwork Lightbox Modal:**
   - Clicking "View Artwork" or the sleeve expands the poster art into an edge-to-edge viewing experience with backdrop blur.
   - Accessible dismissal via close button, clicking outside, or pressing the `Escape` key.
3. **The Shelf Deck ("On Rotation"):**
   - Three tactile record cards along the lower hero tier.
   - Instant visual indicator for "Cued" and "Playing" states.
   - Click to cue and play any record with tactile feedback.
4. **Editorial Tracklist ("My Songs"):**
   - Clean, publication-style list with track indices, titles, subtitles, curator notes, formatted durations, and tactile play triggers with live pulse visualizer.
5. **Docked Minimal Floating Player (`PlayerBar.tsx`):**
   - Grounded at bottom with warm paper blur, artwork thumbnail, title, artist, live scrubber, timecode, prev/play/next, and volume/mute.
   - Responsive and thumb-friendly on mobile (375px–430px) with safe-area inset protection.

---

## 5. Interaction & Shortcuts

- `Space`: Play / Pause toggle
- `←` / `→`: Seek 5 seconds backward / forward
- `↑` / `↓`: Volume adjustment
- `M`: Mute / Unmute
- `1`, `2`, `3`: Jump directly to track 1, 2, or 3
- `Escape`: Close artwork lightbox modal
- Full `prefers-reduced-motion` compliance.
