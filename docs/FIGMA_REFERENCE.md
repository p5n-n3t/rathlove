# Figma Reference for v0

## File

Figma file key:

`1VXBfWeG55khKhxzC6STm0`

This is a multi-page game UI kit containing both reusable components and paired desktop/mobile screen templates. Use the same file key throughout; pages are selected by node/page ID.

## Pages

- `36:4342` — Components
- `563:33038` — --- Templates ---
- `563:33039` — Login / Create Account
- `563:35617` — Settings
- `563:47134` — News
- `639:81446` — Announcements
- `563:37932` — Leaderboard
- `564:69389` — Rewards
- `563:41466` — Quests
- `563:43005` — Level Builder
- `563:43539` — Loading
- `587:107148` — Stats
- `563:43765` — Store
- `563:44707` — Marketplace
- `563:46596` — Search
- `636:18047` — Cover Art

## High-value paired desktop/mobile screens

### Login / Create Account
Page `563:33039`

Useful screen frames include:
- `563:33593` — iPhone 14 & 15 Pro Max - 2, 430×932
- `563:33597` — Desktop - 2, 1440×1024
- `564:72413` — iPhone 14 & 15 Pro Max - 3, 430×932
- `564:72416` — Desktop - 3, 1440×1024
- `564:72711` — iPhone 14 & 15 Pro Max - 4, 430×932
- `564:72714` — Desktop - 4, 1440×1024
- `564:73442` — iPhone 14 & 15 Pro Max - 5, 430×932
- `564:73445` — Desktop - 5, 1440×1024
- `564:74092` — iPhone 14 & 15 Pro Max - 6, 430×932
- `564:74096` — Desktop - 6, 1440×1024
- `564:74776` — iPhone 14 & 15 Pro Max - 7, 430×932
- `564:74780` — Desktop - 7, 1440×1024

Use these for callsign/setup/help/options dialog composition even though RATLOVE does not require account creation.

### Settings
Page `563:35617`

- `639:48374` — Settings Drawer Mobile, 430×932
- `639:48599` — Settings Drawer Desktop, 1440×1024
- `639:49212` — Settings Modal Mobile, 430×932
- `639:48914` — Settings Modal Desktop, 1440×1024

Use for RATLOVE Options: sound, sensitivity, motion intensity, difficulty default, fullscreen/orientation preferences.

### News
Page `563:47134`

- `639:51165` — News Modal Mobile, 430×932
- `639:51166` — News Modal Desktop, 1440×1024
- `639:59680` — News Drawer Mobile, 430×932
- `639:59679` — News Drawer Desktop, 1440×1024

Potential structural donor for Help / How To Play / game-rules presentation.

### Announcements
Page `639:81446`

- `639:84157` — Announcements Drawer Mobile, 430×932
- `639:84156` — Announcements Drawer Desktop, 1440×1024

Useful for first-run hints, patch/news cards, and tutorial notices.

### Leaderboard
Page `563:37932`

- `639:48012` — Leaderboard Drawer Mobile, 430×932
- `639:48061` — Leaderboard Drawer Desktop, 1440×1024
- `563:38795` — Leaderboard Modal Mobile, 428×926
- `639:48198` — Leaderboard Modal Desktop, 1440×1024
- `579:88740` — compact leaderboard modal

This is the primary structural donor for RATLOVE's public leaderboard.

### Rewards
Page `564:69389`

- `638:36378` — Reward Modal Mobile, 428×926
- `639:47850` — Reward Modal Desktop, 1440×1024
- `582:100018` — compact reward modal

Useful for bonus-hit celebrations, Trump Bonus, Mood Basket unlock/remaining-charge feedback, and high-score reward moments.

### Quests
Page `563:41466`

- `617:20206` — Quests Modal Mobile, 428×926
- `639:43751` — Quests Modal Desktop, 1440×1024
- `639:39025` — Quests Drawer Mobile, 428×926
- `639:40175` — Quests Drawer Desktop, 1440×1024

Useful as a structural donor for Help / challenge / rule cards, not necessarily as a literal quests feature.

### Level Builder
Page `563:43005`

- `563:43035` — mobile Level Builder, 428×926
- `587:105824` — desktop Level Builder, 1440×1024

Useful as a dense game-interface reference because it already demonstrates tool/control placement around a larger central content area.

### Loading
Page `563:43539`

- `563:43540` — mobile Loading, 428×926
- `563:43546` — desktop Loading, 1440×1024

Primary structural donor for RATLOVE boot/preload screens.

### Stats
Page `587:107148`

- `639:62231` — Stats Drawer Mobile, 430×932
- `639:62230` — Stats Drawer Desktop, 1440×1024
- `639:61703` — Stats Modal Mobile, 430×932
- `639:61702` — Stats Modal Desktop, 1440×1024

Useful for post-game score breakdown and run telemetry.

### Store
Page `563:43765`

- `639:71217` — Store Modal Mobile, 430×932
- `639:71216` — Store Modal Desktop, 1440×1024
- `639:69934` — Store Drawer Mobile, 430×932
- `639:70007` — Store Drawer Desktop, 1440×1024
- `639:74375` — Subscription Drawer Mobile, 430×932
- `639:74374` — Subscription Drawer Desktop, 1440×1024

Do not add a store unless later requested. Reuse only the layout/interaction primitives where appropriate.

### Marketplace
Page `563:44707`

Contains several mobile/desktop paired drawer and modal compositions, including pagination. Useful as an additional dense card/list reference, not a required RATLOVE feature.

### Search
Page `563:46596`

- `563:46597` — Search, 340×932

May inform compact search/filter controls for leaderboard if needed.

### Cover Art
Page `636:18047`

- `636:18451` — Cover image, 1600×1200
- `636:25819` — Cover image 2, 1600×1200

Use only as composition/reference inspiration if relevant.

## Reusable Components page

Page `36:4342`

High-value component groups:

- `179:10418` — Buttons
- `179:9962` — Modal
- `179:10334` — Rows, including Leaderboard type
- `276:12156` — Forms
- `394:33621` — Navigation
- `179:10389` — Cards
- `394:33643` — horizontal cards/dialog/dock
- `394:33654` — Popups
- `394:33676` — Tabs
- `179:12459` — Status/progress/badges/tooltips
- `179:10507` — Toasts

## Instructions for v0

Use the Figma kit as an implementation accelerator, not as RATLOVE's finished visual identity.

1. Inspect the relevant desktop AND mobile Figma node for each RATLOVE screen before implementing it.
2. Reuse layout hierarchy, modal/drawer sizing, spacing logic, navigation patterns, table structure, button states, and responsive differences.
3. Recreate the components in the local Next.js codebase. Do not leave runtime dependencies on temporary Figma asset URLs.
4. Apply RATLOVE styling over the structure:
   - CRT/pixel arcade framing
   - phosphor/toxic palette
   - dirty municipal sewer signage
   - scanline/glitch effects
   - block/pixel typography
   - sharper, chunkier control treatments
5. Do not blindly copy irrelevant product features such as Store, Marketplace, Rewards, or account creation. Mine them for useful patterns only.
6. Preserve genuinely different desktop/mobile compositions rather than collapsing everything into one generic CSS-responsive layout.
7. Desktop gameplay remains a custom Phaser scene, not a Figma-derived background. Figma informs UI chrome, menus, overlays, HUD panels, modals, leaderboards, settings, help, loading, and results.
