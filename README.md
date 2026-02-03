# Seesaw Simulation

## Overview
A simple browser-based seesaw simulation. Click on the plank to drop a randomly weighted item; the seesaw rotates based on left/right torque difference. The app shows live stats (left weight, angle, right weight) and keeps a log of drops.

## How To Run 
- Option 1: Open `index.html` in a browser 
- Option 2: Run a local static server 

## How It Works
- **Interaction**: Clicking the plank adds a new item at the clicked x-position with a random weight (1–10 kg).
- **Physics model**:
  - Compute left/right torque by summing `weight * distance_to_pivot`.
  - Convert torque difference into an angle and clamp it to a safe range (currently -30° to +30°).
- **UI**:
  - Items render as circles positioned along the plank.
  - Newly added items have a short “drop-in” animation.
  - A stats row shows totals and current angle.
  - A log panel records each drop event and can be cleared.
- **Persistence**:
  - Items and logs are stored in `localStorage` so refresh keeps the current state.

## Thought Process & Design Decisions
While building the project, I followed a simple iteration loop:

- **HTML first (structure)**: I started by laying out the essential elements (scene, plank, stats, and log panel) to make the UI structure clear and testable early.
- **JavaScript next (functionality first)**: I prioritized core behavior (click → add item → compute torques → update angle → render + log). This helped validate the main logic before spending time on styling.
- **CSS last (polish & UX)**: Once the simulation logic felt solid, I iterated on styling (layout, colors, animations) to improve clarity and overall experience.

Key design decisions:
- **State-driven rendering**: A central `state` (items + logs) is the single source of data. UI updates are derived from state, which keeps behavior predictable and easier to debug.
- **Logs as a UX/debug tool**: Each action is recorded with side and distance from the pivot, making it easier to reason about the torque/angle result.
- **Persistence via localStorage**: To avoid losing progress on refresh, I persist both the seesaw state (dropped items) and the log history in `localStorage`.

## Trade-offs / limitations
- **Rendering strategy (performance trade-off)**: Items are rendered using a simple DOM-based approach. This keeps the implementation straightforward, but if many items are dropped, frequent DOM updates (especially full re-renders) may become slower.
- **Local storage limitations**: Persistence uses browser localStorage, which is synchronous and has a limited quota. Very large numbers of items/log entries may hit storage limits or cause slowdowns.
- **Rounding choices**: Distances and angles are rounded for display, which can hide small changes and make the UI feel less smooth at low torque differences. 

## AI assistance
- **Visual improvements**: Suggestions for font choices, color codes/palette, and general CSS styling polish. 
- **Debugging**: Help identifying and fixing syntax mistakes and debugging runtime issues during implementation.