# Asset inventory

The repo contains 41 target-face images, 3 chicken SVGs, and 27 intro/hero/prop images.

## Target variations

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

There are seven target characters in the supplied files. The system is data-driven, so an eighth target can be added later without changing the core engine.

## Canonical paths

- Chickens: `/public/assets/game/chickens/`
- Targets: `/public/assets/game/targets/<character>/<state>/`
- Intro lips/title pieces: `/public/assets/intro/lips/`
- Pixel logos: `/public/assets/intro/logos/`
- Rathbone/Rathlove hero images: `/public/assets/intro/rathbone/`
- Props: `/public/assets/intro/props/`
- Machine-readable manifest: `/src/data/assets.json`

## Variation rule

Every target/state uses a shuffle-bag. Consume every asset in the bag once before reshuffling. Never immediately repeat the last-used asset across a reshuffle unless that state has only one image. Normal faces swap repeatedly during lane movement. Angry and crying bags advance only when that character is hit.
