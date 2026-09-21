# RATLOVE Asset Inventory

The canonical machine-readable registry is `src/data/assets.json`. The files in `public/assets/` are source-of-truth assets and should not be regenerated or silently substituted.

## Gameplay assets

### Target face variations

| Target | Normal | Angry | Crying | Total |
|---|---:|---:|---:|---:|
| Alan | 4 | 1 | 3 | 8 |
| Bibi | 5 | 3 | 2 | 10 |
| Daniela | 1 | 1 | 1 | 3 |
| Epstein | 2 | 1 | 1 | 4 |
| Loomer | 2 | 2 | 2 | 6 |
| Shmuley | 1 | 2 | 1 | 4 |
| Trump | 3 | 2 | 1 | 6 |
| **Total** | **18** | **12** | **11** | **41** |

### Gameplay bonus/special assets

- `/assets/game/targets/trump/bonus/trump-bonus.webp`
- `/assets/game/targets/kippah.svg`
- `/assets/game/mood-basket/mood-basket-cat-1.webp`
- `/assets/game/mood-basket/mood-basket-cat-2.webp`
- `/assets/game/mood-basket/mood-basket-cat-3.webp`
- `/assets/game/mood-basket/mood-basket-cat-4.webp`

### Chicken projectiles

- `/assets/game/chickens/chicken-1.svg`
- `/assets/game/chickens/chicken-2.svg`
- `/assets/game/chickens/chicken-3.svg`

## Intro assets

### Main logos/title art

- `/assets/intro/logos/main-logo-rathbone-in-koosh.webp`
- `/assets/intro/logos/main-logo-rathlove-block-characters.webp`
- `/assets/intro/logos/leaderboard-logo-rathlove.webp`
- `/assets/intro/logos/hasidic.svg`

### Supporting pixelated icons

- `/assets/intro/logos/pixelated-icon-blue.webp`
- `/assets/intro/logos/pixelated-icon-green.webp`
- `/assets/intro/logos/pixelated-icon-red.webp`

### Lips/title pieces

- `/assets/intro/lips/lips-rathbone-is-rathlove.webp`
- `/assets/intro/lips/lips-in.webp`
- `/assets/intro/lips/lips-rath-a-mole.webp`

### Rathbone art

Ten files under `/assets/intro/rathbone/`: five portraits, one clean full-body image, and four full-body glitch frames.

### Props

Thirteen files under `/assets/intro/props/`, including crown, earphones, CRT monitor, three cat treatments, phones, mixtape, long-haired Trump prop, two Koosh toys, and Swatch watch.

### Graffiti

Nine optimized wall-art files under `/assets/intro/graffiti/`.

### Narrative helper icons

Twenty-one SVG helper icons under `/assets/intro/icons/`.

## Variation rule

Every target/state uses a shuffle-bag. Consume every asset in a bag before reshuffling. Never immediately repeat the previous asset across a reshuffle unless the state has only one asset.

## Asset sizing

- Standard target heads: capped at 500 px on the longest side.
- Trump bonus: capped at 700 px.
- Mood-basket cats: capped at 500 px.
- Graffiti: capped at 1200 px.
- Intro props: capped at 1400 px.
- Hero/title graphics: capped at 1920 px.
- SVG files remain vector and are not raster-resized.
