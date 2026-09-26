# Figma Reference for v0

## File

Figma file key:

`1VXBfWeG55khKhxzC6STm0`

The connected file currently exposes one top-level page:

- `36:4342` — Components

This appears to be a reusable game UI component library rather than the separate full desktop/mobile screen layouts described by the project owner.

## Recommended component families to inspect

Use these as STRUCTURAL and INTERACTION references. Do not copy the existing visual skin unchanged.

- `179:10418` — Buttons
  - primary / secondary / positive / negative / disabled
  - default / hover / pressed / inactive states

- `179:9962` — Modal
  - fixed and scalable modal patterns
  - tabs and close affordance

- `179:10334` — Rows
  - includes a dedicated Leaderboard row type
  - table rows, hover rows, slider/store/notification row patterns

- `276:12156` — Forms
  - field states
  - checkbox
  - radio
  - toggle
  - pill
  - stepper and other form controls

- `394:33621` — Navigation
  - centered-button navigation
  - text-header navigation
  - button rows
  - drawer navigation
  - contextual menu
  - pulldown patterns

- `179:10389` — Cards
  - mini cards
  - item cards and interaction states

- `394:33643` — Cards
  - horizontal item card
  - dialog
  - dock card

- `394:33654` — Popups
  - dropdown
  - vertical/horizontal action sheet/drawer

- `394:33676` — Tabs
  - highlighted, active, inactive and hover states
  - tab groups and line tabs

- `179:12459` — Status
  - progress bar
  - slider
  - progress wheel
  - spinner
  - banner
  - tooltip
  - badge

- `179:10507` — Toasts
  - in-game rounded toast
  - drawer toast

## How v0 should use this file

1. Reuse its component hierarchy, sizing logic, state models and interaction conventions as reference.
2. Reimplement those patterns in the project's Next.js/React component system.
3. Reskin them completely for RATLOVE / RATH-A-MOLE:
   - CRT/pixel arcade edges
   - scanlines/glow
   - harder block typography
   - dirty sewer/municipal labels
   - phosphor/toxic palette
   - glitch feedback
4. Prefer importing only the specific relevant Figma nodes above rather than ingesting the entire component page.
5. Do not depend on temporary Figma asset URLs at runtime.

## Missing screen reference

The current file key does NOT expose separate top-level desktop and mobile screen pages through the connector. If those screens live in another file or branch, add their file key and exact node-specific links here before implementation.
