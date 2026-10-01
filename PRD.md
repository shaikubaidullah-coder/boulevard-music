# PRD — PERSONAL MUSIC ARCHIVE / SONG COLLECTION

**Project type:** Personal music archive / digital record collection
**Primary goal:** Build an extraordinary, art-directed website for a personal collection of favorite songs, where each song is represented by its own poster/artwork and playable audio.

**Design direction:** Editorial + physical-media nostalgia + modern interactive art direction.
**Anti-goal:** Generic music player, Spotify clone, template dashboard, AI-generated “premium” landing page, excessive gradients, neon colors, glassmorphism, generic cards, or decorative animation without purpose.

---

# 1. PRODUCT VISION

Create a website that feels less like a conventional music website and more like a **digital private record archive**.

The user should feel like they are entering someone's carefully curated physical collection of music.

Every song has:

* A visual poster / artwork
* An audio file
* A title
* Artist information where available
* Optional metadata
* Its own visual identity
* Its own playback state

The website should make the **artwork and music equally important**.

The experience should combine:

> **A24-like editorial art direction + physical record/media archive + modern interactive web design + premium motion design.**

The A24 reference supplied by the user should be treated as **visual inspiration**, not something to copy literally.

---

# 2. CORE EXPERIENCE

The website should answer one simple question:

> **“What does someone's personal music collection feel like when turned into an interactive digital object?”**

It should NOT feel like:

* Spotify
* Apple Music
* SoundCloud
* YouTube Music
* A normal portfolio
* A grid of music cards
* A generic AI-generated website

It should feel like a **personal artifact**.

---

# 3. AVAILABLE ASSETS

The project folder currently contains only:

```text
music-project/
│
├── song-1/
│   ├── audio file
│   └── poster/image
│
├── song-2/
│   ├── audio file
│   └── poster/image
│
└── song-3/
    ├── audio file
    └── poster/image
```

The implementation must be built around these real assets.

### Critical rule

**Do not invent replacement artwork, fake album covers, fake artist photographs, stock images, or AI-generated placeholder content when the supplied artwork exists.**

The real posters are the primary visual assets.

The audio files are the source of truth for playback.

---

# 4. ASSET DISCOVERY

The AI builder must first inspect the entire project directory before building.

It must determine:

* Number of songs
* Folder structure
* Audio formats
* Image formats
* Image dimensions
* Image aspect ratios
* File names
* Audio duration
* Available metadata
* Whether filenames contain useful metadata
* Whether images are portrait / landscape / square
* Whether there are multiple assets belonging to one song

It must **not assume** that `song-1`, `song-2`, etc. are the final titles.

Create a reliable internal data model based on the discovered assets.

---

# 5. CONTENT MODEL

Each song should conceptually become:

```js
{
  id,
  title,
  artist,
  audio,
  artwork,
  duration,
  metadata,
  index
}
```

Where information is unavailable, the UI should gracefully omit it rather than displaying fabricated information.

Example:

```text
SONG TITLE
Artist

00:00 ━━━━━━━━━━━ 03:42
```

Do not display:

```text
Artist: Unknown Artist
Genre: Unknown
Album: Unknown
Year: 2026
```

unless those values actually exist.

---

# 6. DESIGN PHILOSOPHY

## 6.1 Primary principle

**The content is the design.**

The posters should not be placed inside generic cards just because cards are easy to build.

The composition should be designed around the actual artwork.

The site should feel intentionally art-directed.

---

# 7. VISUAL INSPIRATION

The supplied A24 screenshot establishes several useful principles:

### Editorial typography

Large serif typography.

Small technical metadata.

Strong typographic hierarchy.

Thin rules.

Generous whitespace.

Asymmetrical composition.

Controlled alignment.

Minimal interface chrome.

---

### Physical-media feeling

The screenshot's record/CD objects are important conceptually.

The site should explore the idea that:

> digital music can behave like a physical collection.

Possible visual metaphors:

* CD
* vinyl
* record sleeve
* paper archive
* printed poster
* catalogue
* exhibition
* music library
* private collection

Do NOT turn every element into a literal 3D vinyl disc.

Use physical-media references selectively.

---

# 8. DESIGN LANGUAGE

The overall aesthetic should be:

**quiet + tactile + editorial + cinematic + slightly nostalgic + contemporary**

Not:

**loud + futuristic + neon + cyberpunk + SaaS + dashboard**

---

# 9. COLOR SYSTEM

The color system should primarily be extracted from the supplied artwork.

The application should have a restrained global foundation such as:

* warm white / paper
* off-white
* charcoal
* near-black
* muted gray

Then allow artwork-specific accent colors to influence certain contextual elements.

For example:

```text
Base:
Paper
Ink
Muted Gray

Dynamic:
Artwork-derived accent
Artwork-derived secondary tone
```

Avoid hardcoding dozens of arbitrary colors.

Use semantic design tokens.

---

# 10. TYPOGRAPHY

Typography should create much of the personality.

Recommended system:

### Display

Editorial serif.

Use for:

* Website title
* Song titles
* Major statements
* Large numbers

### UI / metadata

Clean modern sans-serif.

Use for:

* Navigation
* Metadata
* Playback controls
* Labels
* Time
* Technical information

### Optional technical layer

Monospace can be used sparingly for:

* Track number
* Duration
* Archive information
* Playback time

Typography must be deliberate.

Do not use five or six fonts merely to appear sophisticated.

---

# 11. INFORMATION ARCHITECTURE

The experience should contain approximately:

```text
HOME / ARCHIVE
      ↓
SONG DETAIL / FOCUSED PLAYER
      ↓
PLAYBACK
      ↓
COLLECTION NAVIGATION
```

The exact implementation can evolve after inspecting the reference website.

---

# 12. HOME / ARCHIVE EXPERIENCE

The landing screen should immediately communicate:

> **This is someone's music archive.**

Possible structure:

```text
[COLLECTION / PERSONAL MUSIC ARCHIVE]

                        03 TRACKS
                        00:XX:XX

────────────────────────────────

01
SONG TITLE
ARTIST

[ LARGE ARTWORK ]

02
SONG TITLE
ARTIST

[ LARGE ARTWORK ]

03
SONG TITLE
ARTIST

[ LARGE ARTWORK ]
```

However, the builder should not blindly implement this exact layout.

It must explore the supplied website inspiration and choose the strongest composition.

---

# 13. AVOID STANDARD CARD GRID

Do NOT default to:

```text
┌──────────┐ ┌──────────┐ ┌──────────┐
│  IMAGE   │ │  IMAGE   │ │  IMAGE   │
│          │ │          │ │          │
├──────────┤ ├──────────┤ ├──────────┤
│ Song 1   │ │ Song 2   │ │ Song 3   │
│ Artist   │ │ Artist    │ │ Artist   │
└──────────┘ └──────────┘ └──────────┘
```

That is the easiest implementation and exactly the kind of generic AI-generated design this project is intended to avoid.

---

# 14. ARTWORK PRESENTATION

Artwork should have multiple possible presentation states.

### Resting state

Artwork exists naturally in the composition.

### Hover state

Subtle:

* scale
* translation
* crop movement
* typography shift
* cursor interaction
* image treatment

### Active state

When a song is playing:

* artwork becomes visually active
* subtle motion can occur
* playback indicator appears
* typography changes state
* progress becomes visible

Motion must remain restrained.

---

# 15. SONG DETAIL EXPERIENCE

Selecting a song should transition into a focused listening experience.

Possible composition:

```text
                SONG TITLE

              ┌───────────┐
              │           │
              │  POSTER   │
              │           │
              └───────────┘

              ARTIST

       00:42 ━━━━━━━━━━━ 03:51

          ◀     PLAY     ▶

       01 / 03
```

But the exact composition should be determined after studying the supplied reference website.

The key requirement:

**It must feel like entering a piece of the archive, not opening a modal.**

---

# 16. AUDIO PLAYER

The audio player is a core product feature.

It must support:

### Required

* Play
* Pause
* Seek
* Current time
* Total duration
* Progress
* Previous track
* Next track
* Track switching
* Persistent playback state while navigating
* Keyboard controls where appropriate

### Recommended

* Volume
* Mute
* Playback progress persistence
* Spacebar play/pause
* Arrow-key seeking
* Media-session support where practical

---

# 17. GLOBAL MINI PLAYER

Once music starts playing, the site should maintain a persistent player.

It can become a small architectural element of the website.

Example:

```text
┌─────────────────────────────────────────────┐
│ ●  SONG TITLE     ARTIST      01:24 ━━━━━ ▶ │
└─────────────────────────────────────────────┘
```

The player should not destroy the visual composition.

It should feel integrated into the design.

---

# 18. PLAYBACK STATES

The UI must visually distinguish:

### Idle

Nothing playing.

### Playing

Current track actively playing.

### Paused

Current track selected but paused.

### Loading

Audio is loading.

### Ended

Track finished.

### Error

Audio cannot be loaded.

Do not silently fail.

---

# 19. TRANSITIONS

Page transitions should feel like moving through an archive.

Potential motion language:

* image expansion
* editorial wipe
* typography displacement
* crossfade
* masked image reveal
* horizontal movement
* subtle scale transition

Avoid:

* random bouncing
* excessive spring effects
* huge zooms
* unnecessary parallax
* particle backgrounds
* flashy loading animations

Every animation needs a reason.

---

# 20. MICRO-INTERACTIONS

Use motion to communicate state.

Examples:

### Play

Play icon transitions naturally into pause.

### Hover

Artwork subtly responds to pointer movement.

### Track selection

Selected artwork becomes dominant.

### Navigation

Transition maintains visual continuity.

### Progress

Progress indicator moves smoothly.

### Cursor

A custom cursor may be used if it genuinely improves the experience.

If implemented:

* desktop only
* disabled/reduced on touch devices
* never blocks clicks
* never causes performance problems

---

# 21. CUSTOM CURSOR

A custom cursor is allowed but **not mandatory**.

If used, it should be editorial and minimal.

Potential states:

```text
DEFAULT
VIEW
PLAY
DRAG
```

Do not create a giant glowing circle following the mouse.

The cursor should feel like part of the art direction.

---

# 22. MOTION SYSTEM

Use the `apple-design` principles.

Motion should have:

* natural easing
* continuity
* appropriate duration
* clear spatial relationships
* interruptibility
* reduced-motion support

Animations should communicate:

> where something came from, where it is going, and why.

Not:

> “look, this website has animations.”

---

# 23. RESPONSIVE DESIGN

Mobile is not a secondary version.

The site must be designed for:

```text
Desktop
Tablet
Mobile
Touch
```

from the beginning.

---

# 24. MOBILE EXPERIENCE

On mobile:

* no hover dependency
* no custom cursor
* no oversized desktop compositions
* no horizontal overflow
* no inaccessible controls
* artwork remains visually dominant
* playback controls remain thumb-accessible
* text remains readable
* transitions remain performant

Touch interaction must never interfere with scrolling.

This is especially important for gesture-heavy compositions.

---

# 25. RESPONSIVE ARTWORK

Artwork should preserve its visual integrity.

Avoid blindly applying:

```css
width: 100%;
height: 100%;
object-fit: cover;
```

to everything.

The correct treatment should depend on the artwork.

Some images may require:

* contain
* cover
* custom crop
* fixed aspect ratio
* natural aspect ratio

The builder should inspect the actual supplied posters.

---

# 26. PERFORMANCE

The site may contain large images and audio files.

Therefore:

* lazy-load non-visible artwork
* preload only the currently relevant audio
* avoid loading every track simultaneously
* optimize image rendering
* avoid unnecessary re-renders
* use GPU-friendly transforms
* avoid huge continuous animations
* respect `prefers-reduced-motion`

Do not sacrifice performance merely to add visual effects.

---

# 27. ACCESSIBILITY

The site must remain usable without relying entirely on visual effects.

Required:

* semantic buttons
* keyboard navigation
* visible focus states
* accessible audio controls
* meaningful image alt text
* sufficient text contrast
* reduced-motion support
* touch-friendly controls

Do not hide important controls behind mysterious gestures.

---

# 28. DESIGN SYSTEM

Before implementing the final UI, create a semantic design system.

Example:

```text
DESIGN TOKENS

COLOR
--paper
--ink
--muted
--line
--accent

TYPOGRAPHY
--font-display
--font-body
--font-mono

SPACING
--space-xs
--space-sm
--space-md
--space-lg
--space-xl

RADIUS
--radius-small
--radius-medium

MOTION
--ease-standard
--ease-emphasized
--duration-fast
--duration-medium
--duration-slow
```

Do not scatter random values throughout the application.

---

# 29. SKILLS — REQUIRED WORKFLOW

The following skills are part of the project specification.

## `hallmark`

Use for:

* initial visual direction
* anti-AI-slop decisions
* reference analysis
* composition
* art direction
* design audits
* redesign decisions

This should be treated as the **anti-generic-design layer**.

---

## `design-taste-frontend`

Use for:

* typography hierarchy
* layout
* calibrated palette
* responsive design
* visual hierarchy
* motion
* component quality

---

## `apple-design`

Use for:

* animation
* micro-interactions
* transitions
* interaction states
* typography refinement
* responsive behavior

---

## `design-md`

Use to establish the project's semantic design system.

Create or update:

```text
DESIGN.md
```

It should document:

* colors
* typography
* spacing
* components
* motion
* responsive rules
* interaction rules
* visual principles

---

## `design-system-compliance`

Run after implementation.

Inspect the actual rendered application for:

* hardcoded colors
* inconsistent spacing
* incorrect typography
* off-palette elements
* broken animations
* inaccessible controls
* responsive inconsistencies
* accidental generic UI
* component inconsistencies

Fix the problems rather than simply reporting them.

---

# 30. REFERENCE WEBSITE ANALYSIS

When the user provides the design-inspired website:

**Do not simply copy its HTML/CSS or reproduce it mechanically.**

Analyze:

### Layout

* grid
* whitespace
* alignment
* hierarchy
* composition

### Typography

* typefaces
* scale
* weight
* tracking
* line height

### Color

* background
* foreground
* accent
* contrast

### Motion

* entry animation
* hover behavior
* scroll behavior
* transitions
* interaction feedback

### Interaction

* navigation
* cursor
* gestures
* playback
* image behavior

### Art direction

Determine **why the design works**, then translate those principles into an original music archive.

---

# 31. DESIGN INSPIRATION IMAGE ANALYSIS

The supplied A24 reference should influence:

* editorial composition
* typography
* whitespace
* restrained palette
* physical-media concept
* asymmetric layout
* cultural/editorial feeling

But the final site must become its own visual language.

The goal is:

> **Inspired by the principles, not a clone of the reference.**

---

# 32. CONTENT HIERARCHY

The hierarchy should generally be:

```text
1. Artwork
2. Song title
3. Artist
4. Playback state
5. Archive information
6. Secondary metadata
```

The artwork should not be visually subordinate to the UI.

---

# 33. ARCHIVE DETAILS

Small details can make the website feel like a real collection.

Possible elements:

```text
01 / 03
TRACK
ARCHIVE
LISTENING NOW
SIDE A
COLLECTION
03 TRACKS
TOTAL PLAYTIME
```

These should be used sparingly.

Do not fill the interface with labels merely to make it look “designed.”

---

# 34. EMPTY / ERROR STATES

If an audio file is missing:

```text
AUDIO UNAVAILABLE
```

If artwork is missing:

Use a restrained typographic fallback rather than a random placeholder image.

If there are no songs:

Provide a simple archive-empty state.

Never use generic stock placeholders.

---

# 35. TECHNOLOGY

The AI builder may choose the appropriate modern frontend stack, but it must prioritize:

* fast local asset loading
* clean component architecture
* maintainability
* responsive behavior
* accessible controls
* smooth animation
* simple deployment

Do not introduce unnecessary backend infrastructure.

For the current project:

**A frontend-only architecture is preferred unless the provided reference or future requirements justify a backend.**

---

# 36. DATA ARCHITECTURE

Keep song information centralized.

Preferred structure:

```text
src/
├── components/
├── data/
│   └── songs.*
├── hooks/
├── styles/
├── utils/
└── ...
```

or an equally clean architecture appropriate to the chosen framework.

Do not hardcode the same song information into multiple components.

---

# 37. FUTURE EXTENSIBILITY

Although this first version is intentionally small, the architecture should allow future additions such as:

* more songs
* albums
* playlists
* favorites
* listening history
* search
* filters
* artist pages
* lyrics
* metadata
* vinyl/CD visualizations
* multiple collections

But **do not build these features now unless required.**

The first version should be extremely polished rather than bloated.

---

# 38. WHAT “EXTRAORDINARY” MEANS FOR THIS PROJECT

Extraordinary does **not** mean:

* more animations
* more gradients
* more 3D
* more effects
* more components
* more text
* more features

It means:

### Art direction

The entire website feels intentionally composed.

### Interaction

Every interaction feels considered.

### Typography

Typography carries personality.

### Content

The actual music and artwork remain the hero.

### Motion

Animation creates continuity.

### Detail

Small elements feel finished.

### Restraint

Nothing exists purely because an AI builder knows how to generate it.

---

# 39. ANTI-AI-SLOP RULES

The builder must actively reject:

```text
❌ Generic hero section
❌ Gradient blobs
❌ Neon purple/blue AI aesthetic
❌ Glassmorphism everywhere
❌ Generic cards
❌ Generic rounded buttons
❌ “Welcome to my music”
❌ Stock imagery
❌ Fake testimonials
❌ Fake statistics
❌ Excessive shadows
❌ Random decorative icons
❌ Excessive 3D
❌ Random particles
❌ Huge meaningless headings
❌ Template-like layouts
❌ Excessive border-radius
❌ Animation for animation's sake
❌ Fake metadata
❌ Fake album information
```

If an element does not improve the experience, remove it.

---

# 40. QUALITY BAR

Before considering the project finished, ask:

### Visual

* Does this look like a designed artifact rather than an AI-generated website?
* Does the composition work without animation?
* Does typography feel intentional?
* Are the posters treated as artwork rather than cards?

### Interaction

* Does playback feel natural?
* Are transitions coherent?
* Is the active song obvious?
* Does navigation preserve context?

### Responsive

* Does mobile feel intentionally designed?
* Does touch interaction work?
* Does the artwork still look good?
* Are controls usable?

### Technical

* Are all audio files correctly connected?
* Are images loaded efficiently?
* Are there console errors?
* Are there broken routes?
* Are there accessibility problems?
* Are animations performant?

---

# 41. REQUIRED BUILD PROCESS

The AI builder should follow this sequence.

```text
PHASE 01
Inspect entire project
        ↓
PHASE 02
Inspect every audio + poster asset
        ↓
PHASE 03
Analyze supplied visual inspiration
        ↓
PHASE 04
Analyze supplied reference website
        ↓
PHASE 05
Extract design principles
        ↓
PHASE 06
Create DESIGN.md
        ↓
PHASE 07
Create information architecture
        ↓
PHASE 08
Build core visual system
        ↓
PHASE 09
Implement archive
        ↓
PHASE 10
Implement audio engine
        ↓
PHASE 11
Implement song detail experience
        ↓
PHASE 12
Implement motion
        ↓
PHASE 13
Responsive/mobile implementation
        ↓
PHASE 14
Accessibility + performance pass
        ↓
PHASE 15
Design-system compliance audit
        ↓
PHASE 16
Visual refinement
        ↓
PHASE 17
Final QA
```

---

# 42. ITERATION PRINCIPLE

Do not stop after the first successful implementation.

The builder should perform at least three distinct passes:

### PASS 1 — Functional

Everything works.

### PASS 2 — Art direction

Improve:

* composition
* typography
* spacing
* artwork treatment
* hierarchy
* transitions

### PASS 3 — Refinement

Look for:

* awkward spacing
* generic components
* inconsistent motion
* visual noise
* mobile issues
* accessibility issues
* performance issues
* unnecessary elements

Then remove or fix them.

---

# 43. FINAL DEFINITION OF DONE

The project is complete only when:

* Every supplied song is discoverable.
* Every supplied audio file plays correctly.
* Every supplied poster is displayed correctly.
* Playback controls work.
* Track switching works.
* Desktop is polished.
* Mobile is intentionally designed.
* Animations are smooth.
* Reduced motion is supported.
* No fake content exists.
* No major accessibility problems exist.
* No major console errors exist.
* Design tokens are documented.
* The actual rendered UI has passed the design-system compliance review.
* The visual result does not resemble a generic AI-generated music template.
* The website feels like a **personal digital music artifact / archive**.

---

# 44. MOST IMPORTANT PRINCIPLE

> **Build the experience around the music and artwork, not around the capabilities of the AI builder.**

The AI builder is responsible for solving the technical implementation.

The design must remain **editorial, intentional, tactile, restrained, highly interactive, and unmistakably personal**.

The supplied artwork and audio are the source material.

The A24 reference is inspiration.

The provided skills are the quality-control system.

The final website should feel like something that could plausibly exist as a carefully art-directed digital exhibition—not something generated from a “music website” prompt.
