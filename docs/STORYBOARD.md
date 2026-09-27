# RATH-A-MOLE — Opening Film and Round Journey

The 90-second opening is an animated municipal emergency broadcast, not the round timer. It precedes the menu. It must be skippable, replayable, readable without sound, and restrained in reduced-motion mode. The current implementation is a first-pass timed cinematic with live city/CRT layers and chapter cards; the authored film pass described below remains in progress.

## Film: 0:00–1:30

| Time | Beat | Picture and audio direction |
| --- | --- | --- |
| 0:00–0:10 | Signal acquired | Black CRT opens to municipal diagnostic. The supplied CRT prop exposes the investigation; unstable telemetry and boot chirps. Streets slowly materialize behind the signal. |
| 0:10–0:23 | The city is hungry | Slow push through a humid New Orleans-inspired night street: iron balconies, mismatched storefront heights, market signage, headlights, flapping awnings, and wall-matched supplied graffiti. A newspaper headline interrupts the scene. |
| 0:23–0:36 | Infestation: impolite | Rats interrupt food delivery; a cat peeks out, another reaches across frame, a third flies across the tracking line. Foreground traffic passes at a different speed to the balconies. This should read as incidents, not a panning static wallpaper. |
| 0:36–0:49 | Help wanted | Municipal classified broadcast; fast portrait scan through all five Rathbone portraits. Koosh lettering and the lip/title pieces collide with his recruitment notice. No external voice actor. |
| 0:49–1:02 | Rathbone accepts | Full-body hero and glitch frames. Consumer junk commercial interruption: phones, StarTAC, Swatch, mixtape, earphones, crown, Koosh props. Deliberately absurd timing with intentional hard cuts. |
| 1:02–1:15 | The cats object | Mood Basket-adjacent city cats demand credit; inserts of civic paperwork and helper pictograms. The supplied graffiti is painted in perspective on different building planes, never as free-floating gallery images. |
| 1:15–1:25 | Down below | Dolly toward manhole; city noise sinks below pipe resonance. The full sewer reveal waits for player setup; this only teases the descent. |
| 1:25–1:30 | Title lock | CRT cuts out. `Rathbone IN RathLove RATH-A-MOLE` title composition resolves using the two supplied hero logos. A held beat carries into the menu. |

The current cinematic implementation uses eight timed captions, city façade, a car pass, supplied rotating wall graffiti/icons/props and Rathbone/logo overlays. **Not yet complete:** a fully choreographed 90-second scene-by-scene film; integration of every intro asset in an independently verified shot; music/ambience; physically rich pedestrian/traffic incidents. Do not claim these are complete. Film pacing should be refined without shortening the 90-second target.

## Main menu to round

Menu: idle CRT attract display with supplied Rathbone Koosh and RathLove block-character art, rendered `RATH-A-MOLE` game title, play, leaderboard, options, help, replay cinematic. Setup: callsign 1–16 allowed characters and easy/medium/hard, then chicken primer. Sewer descent begins **only after setup**, takes about six seconds, then server creates the game session and starts the separate 90-second round. This ordering prevents cinematic/transition time consuming gameplay time.

## Round and end

Four ratways, lower-center sling, 90 seconds. Heavy/balanced/fast chickens have distinct flight and impact behavior; four limited cats provide an area blast. Bonus appears exactly twice, off the ordinary lanes. At 15 seconds remaining, tunnel panic boosts score and enemy travel. At zero, launches stop; fired shots have 500ms to resolve. Results display score, hits, shots, accuracy, best streak and filing status. Public leaderboard shows server-approved runs, with a retry action if the network failed. There is no conventional login.
