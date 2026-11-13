# Portfolio design and provenance

## Published checkpoint and local work

The gallery and Chinese-signature release was merged as [PR #9](https://github.com/Rainnnee/rainpiao/pull/9), commit `8bfad009be1cf52295e924304e5f09f3a294c811`. The public website was checked after deployment. The subsequent editorial redesign was reviewed locally on `feat/portfolio-personal-redesign`. Rain approved publishing this design checkpoint on October 27, 2026.

## Visitor experience

Visitors should immediately understand who Rain is, find relevant work, and explore further without having to solve a navigation puzzle. Semantic HTML holds the full content. Native links open project notes; audio plays only when requested. No build system, framework, account, or backend is needed.

The default Immersive view keeps Rain’s bright blue, pink, and white skyline. Reading is a denser CV presentation with a white background, serif text, professional project titles, expanded methods/coursework, and a larger golden-hour portrait. Reading omits Music and the personal-interest section. One switch selects and saves the mode. This preference is shared with project pages.

## Visual language

The redesign replaces repeated frosted cards with several coordinated surfaces. Navy ink, warm paper, restrained borders, and a common serif/sans pairing connect the sections. The visual distinction comes from composition and material, rather than a different unrelated style in every section.

- **About:** An open composition with Rain’s Chinese signature, a direct first-person introduction, and a larger pier selfie with a simple paper frame. The selfie keeps its natural landscape proportion, slight crop, left-of-center subject, and room around the outstretched hand. The introductory copy uses Rain’s supplied academic programmes, sophomore status, BruinML/ACM AI work, and CFan/SouLA participation.
- **Signature:** `rain-piao-signature.jpg` is Rain’s supplied 1035 × 645 JPEG. A native SVG viewport trims the surrounding paper; a luminance-to-alpha filter makes the white paper transparent. The original handwriting is preserved. Displayed ink matches the site’s navy (`#193d5b`) at 98% opacity, following Rain’s request for a darker signature that sits naturally beside the text. The heading’s accessible name remains “Rain Piao.”
- **Education:** A warm paper record with a strong UCLA-blue top rule, prominent university name, the larger user-supplied UCLA script wordmark, and a compact Pennington line (2022–2025). UCLA remains the primary entry. Coursework uses a native disclosure.
- **Experience:** Tall paper cards in a horizontally browsable gallery. Wide screens show two full cards and a peek at the next, medium screens one plus a peek, and narrow screens a swipeable single-card view. Each cover represents its subject: a CLIP patch grid, playing cards, the real 48-hour DataFest duration, trading-method labels, or a LiDAR point cloud and bounding box. These are decorative code-native illustrations, not fabricated data plots. All covers share the same logo position, type treatment, number placement, and geometry. Hover details are optional; motion never gates the information.
- **Gallery controls:** Previous/next arrows, a visible card-range readout, and indexed project buttons supplement native horizontal scrolling. Focused gallery controls support ArrowLeft/Right and Home/End. The gallery does not auto-advance or hijack vertical page scrolling. The last card has an end snap point so navigation can reach and display the final two cards properly.
- **Skills:** Plain expandable rows show methods and tools without invented proficiency scores. Reading expands all groups and coursework; returning to Immersive restores earlier disclosure states.
- **Clear-sky ending:** The reveal is attached to the closing section at the very bottom of the page, with “See you around.” and the GitHub/LinkedIn links. Rain found a purely decorative interval in the middle of the page purposeless, so that gap was removed. A second gradient mask intersects the global blur mask, creating a softly feathered opening through the same fixed skyline. No extra background is scrolled or substituted. The window’s coordinates update continuously with the closing section’s position. Reading retains the links in a plain footer.
- **Music:** “There’s music here, too.” retains the casual tone Rain specifically approved. A dark-blue listening surface gives the existing waveform players a distinct setting. The supplied tracks are available directly; there is no duplicate teaser card or autoplay.
- **Personal:** A running record on pale green paper, a dark VALORANT display, a theatre programme, a lilac SouLA note, and a warm-paper chess entry provide different formats for different subjects. Chess has a faint checkerboard, while SouLA uses quiet sound-wave-like rings. All remain restrained enough to read.

## Opening and background behavior

The opening wordmark resolves from blur to clear while rising slightly over two seconds. Its underline appears at the same time, growing from the middle. There is no extra hold: the masthead then contracts over 1.4 seconds to a 27svh banner, carrying the same name upward without zooming. The total sequence is about 3.4 seconds. It replays on normal browser refresh in Immersive mode. An observed Command-R/Control-R shortcut sets a one-use, five-second hint so that keyboard reload can skip the intro; the hint is consumed immediately, applies only to a reload navigation, and cannot suppress a later normal refresh. Browsers that reserve the shortcut and do not dispatch its key event fall back to playing the intro. Mouse-wheel/trackpad input, touch, pointer input, Tab, Escape, and navigation keys bypass it. Programmatic scroll events from layout changes do not dismiss the intro. An intentional bypass does not restore an older hash and pull the visitor away from a link they just selected. Rain requested that Immersive retain the name reveal even when the browser reports reduced motion. Reading is the selectable still presentation; it disables the intro and other animation. The no-mode fallback continues to honor reduced motion.

The full-resolution skyline is one fixed image. A lightweight preview appears first, then fades into the decoded PNG. The global blurred white wash follows the content edge below navigation with unclamped, continuous gradient coordinates. This avoids the earlier sudden change when the navigation becomes sticky or the ramp crosses the top edge. Text areas have a brighter wash; most of the banner retains the sky’s original colors. The clear-sky ending only changes the blur mask.

## Copy and factual boundaries

All homepage and project-page copy was reviewed. The tone is direct, first-person, and occasionally conversational, following Rain’s feedback; it avoids invented jokes, motivations, and expertise claims. Generic future promises and repeated academic-interest lists were removed. Professional Reading titles are CLIP-Based Out-of-Distribution Detection, Poker Decision Modeling, Healthcare Data Analysis, Algorithmic Trading Strategies, and LiDAR Traffic-Monitoring System.

Project details come from Rain’s statements, the existing repository, and the LinkedIn projects reviewed during the gallery work. BruinML’s 19.9% to 97.7% detection-power comparison is explicitly limited to one simulated Gaussian-mixture setting at a 5% false-positive target; it is not a general accuracy score. The ALT submission remains awaiting a decision. No unprovided paper PDF or code repository is linked. Chess and VALORANT ratings are dated rather than implied to update live. CFan/SouLA names and contributions follow Rain’s corrections. There is no résumé-download link because Rain has not supplied that document.

## Artwork and inspiration

`assets/images/sky-full.png` is the 3344 × 1880 PNG supplied by Rain on 2026-10-13. It is stored byte-for-byte, without lossy compression or resizing. `assets/images/sky-preview.jpg` is a 1600 × 899 preview displayed immediately while the full PNG loads; the crisp image fades in once the browser has decoded it. The preview uses the same crop as the full image. No Xeuphoria album artwork is distributed with this site.

The About section uses two supplied portraits: `assets/images/rain-piao-pier-selfie.jpg` (1200 × 900) in Immersive mode and `assets/images/rain-piao-sunset-portrait.jpg` (900 × 1200) in Reading mode. Both keep the photographs’ natural color. Immersive uses the pier selfie in a landscape frame, preserving Rain’s left-of-center position and room around the outstretched hand; Reading uses the golden-hour portrait in a tighter vertical crop. The original uploads are not included in the repository. The Immersive running card includes the 1080 × 2341 Apple Watch workout screenshot supplied by Rain. CSS crops it within a restrained portrait preview while adjacent text repeats the distance, workout time, and pace so the key facts do not depend on reading the screenshot.

`assets/audio/breath-away.m4a` and `assets/audio/camelia-overdose.m4a` are AAC listening copies made from the WAV tracks Rain supplied. The masters remain outside the repository. The players use `preload="none"`, so audio is downloaded only when a visitor starts playback. Precomputed SVG waveforms are seekable; native audio controls remain available when JavaScript is disabled. Durations are 4:40 and 2:39.

All five experience entries link to static detail pages in `projects/`, including BruinML research. Each page uses only the roles, methods, and outcomes supplied by Rain or reviewed on Rain’s LinkedIn, and provides a path back to Experience. The ACM AI Poker Decision Model page is marked in progress and describes the project question—estimating fold, call, and raise probabilities from the current game state and observed opponent behavior—without implying completed results. The Immersive personal section has separate entries for running, chess, VALORANT, CFan Theatre, and SouLA A Cappella; the music players have their own section. It shows Rain’s approximate Lichess blitz rating, VALORANT current and peak ranks, CFan acting credits and sound/music contributions, and SouLA vocal and production roles. The CFan and SouLA cards link to their public Instagram accounts. The VALORANT rank badges are prominent above their written rank names; CFan’s winter skit is listed as 《安可》 and 《生死客》 is identified as a fall play.

Interest-card icon provenance: `assets/images/lichess-favicon-128.png` comes from the [Lichess logo assets](https://github.com/lichess-org/lila/blob/master/public/logo/lichess-favicon-128.png); `assets/images/valorant-logomark-red.png` comes from Riot’s [VALORANT press assets](https://www.riotgames.com/en/press); the Platinum 3 and Diamond 2 badges are Riot game assets served through the [community-maintained VALORANT API](https://valorant-api.com/v1/competitivetiers); `assets/images/cfan-theatre-logo.jpg` and `assets/images/soula-logo.jpg` are the public profile icons from [CFan Theatre](https://www.instagram.com/cfanucla/) and [SouLA A Cappella](https://www.instagram.com/soulaacappella/), respectively. The poker project uses the blue AI logomark from the official [ACM at UCLA AI brand guide](https://design.uclaacm.com/committees/ai/) (`assets/images/acm-ai-logo.png`).

The color and atmosphere reference requested by Rain includes:

- [Xeuphoria — Piano Book](https://music.apple.com/us/album/piano-book/1800022237)
- [Xeuphoria — Piano Sessions: Sakura](https://www.xeuphoria.com/)
- [Xeuphoria — Piano Sessions: Reflections](https://www.youtube.com/watch?v=TvSZGenmAlk)
- [Xeuphoria — Evolve, containing “Nerves”](https://officialxeuphoria.bandcamp.com/album/evolve)

The README opens with Rain’s personal tribute to Xeuphoria, whose piano sessions accompanied them while studying, thinking, and unwinding. The site’s visual direction is a homage to the worlds their music and album artwork evoke; this does not imply affiliation or endorsement.

The ASA DataFest badge in Immersive mode uses the official 200 × 200 PNG published in the American Statistical Association’s [graphic standards](https://www.amstat.org/graphic-standards). It appears only beside Rain’s participation in that event. The IMC Prosperity 4 project thumbnail uses the event artwork published on [IMC Prosperity](https://prosperity.imc.com/). The LiDAR traffic monitoring project uses the Seyond logo published on [Seyond’s website](https://seyond.com/wp-content/uploads/2024/11/logo-01.png). The retained, currently unused Logic Pro asset is Apple’s app artwork from its [App Store listing](https://apps.apple.com/us/app/logic-pro/id634148309). BruinML’s small Immersive-mode mark comes from the organization’s [LinkedIn profile](https://www.linkedin.com/company/bruinml); the organization name remains visible as text in both modes. The UCLA script wordmark was supplied by Rain and is displayed at a larger letterhead scale in Immersive mode, alongside the institution’s full name and degree text. A native SVG viewport trims the surrounding whitespace while a luminance-based filter removes the white paper without changing the blue mark’s geometry. The previously supplied boxed wordmark is retained as an unused asset. Rain confirmed the asset would be used in accordance with UCLA Policy 110 and its brand guidelines. Reading mode hides both institution and organization logo images.


## Attribution and maintenance

The footer mirrors the attribution Rain requested from the GitHub profile: visual inspiration from [wacca_わっか](https://x.com/wacca005)’s cover art for [*Piano Sessions: Reflections*](https://music.apple.com/us/album/piano-sessions-reflections/1700905900), a Xeuphoria × OneChilledPanda collaboration. The user-supplied website background is AI-generated; this attribution does not claim the artist created it or imply endorsement. The README retains Rain’s personal tribute to Xeuphoria.

Source for the matching wording: [Rain’s GitHub profile README](https://github.com/Rainnnee/Rainnnee/blob/main/README.md), reviewed on 2026-10-22. No new raster artwork was generated for this redesign; the project-cover motifs and decorative details are HTML/CSS/SVG.

Keep content in semantic HTML, styling in `assets/styles/`, and the small interaction layer in `assets/scripts/`. Keep asset links relative for the `/rainpiao/` Pages path. Preserve the full-resolution source skyline and user-supplied portrait colors. Local screenshots stay outside the repository. Preview desktop and mobile, test both modes, review changes, and publish only at agreed feature milestones.

## Vector artwork refinement — October 2026

The gallery now uses five original SVG illustrations in `assets/images/concepts/`. Rain clarified that richer concept artwork means more accurate visual storytelling, without explanatory flowcharts, extra thumbnail labels, or new blocks of project copy. Each illustration therefore depicts the task itself: a patched image and magnified local anomaly for BruinML; playing cards, chips, and visual decision branches for poker; layered data and analysis sheets for DataFest; an oscillating signal, protective bracket, and testing loop for trading; and vehicle-shaped point clusters with current/previous bounding boxes for LiDAR. The artwork contains no explanatory text beyond the playing-card ranks and suits. The existing category and card number remain outside the artwork.

These are illustrative scenes, not experimental heatmaps, patient records, market performance charts, or recorded sensor data. The trading reference line is a conceptual mean, with no price axis or returns claim. The poker branches suggest discarding, matching, and increasing without fabricated probabilities. Small decorative sleeve designs beside the music players are CSS artwork, not album covers supplied by the artist. New artwork remains local for review; no raster images or AI-generated assets were needed.

Music metadata supplied by Rain: Breath Away is Melodic Dubstep at 73 BPM, B♭ major / G minor; Camelia Overdose is UK Hardcore at 235 BPM, C minor / E♭ major. Genres sit directly beneath the track titles, with tempo and key in a compact row above the waveform. The VALORANT peak rank is Diamond 2; its badge comes from the same documented game-asset API (competitive tier set `03621f52-342b-cf4e-4f86-9350a49c6d04`, tier 19). The signature ink now matches the site’s navy text.

## Project library and Toolkit iteration — local preview

The editorial design and approved vector artwork were published in [PR #10](https://github.com/Rainnnee/rainpiao/pull/10), squash commit `ed7a6c86db1be0359e70a8f61a83a5ab8308fcab`; the public page was verified after deployment. The following work is on `feat/project-library-and-toolkit` for preview.

Work is divided into Research, ML projects, Software projects, and Competitions & distinctions. Immersive leads with an ML feature, places Research and Software in independent supporting shelves, and uses a shorter row for competitions. Reading keeps the full grouped document. Concise summaries improve scanning; full notes stay on detail pages. Reading keeps the same classification in a continuous text list. The empty employment scaffold is a separate chronological timeline; no position or employer is invented, and neither a section nor a navigation link appears until real data is supplied.

Pusheng's original SVG cover shows an original engraved-note motif becoming discrete notes on a MIDI piano roll. It follows the same quiet, detailed vector-art language as the other covers, with no explanatory diagram labels. Its ongoing status and current recognition/evaluation stage are explicit. The repository address is confirmed in the local project's Git remote and is labeled not public yet.

Toolkit uses a unified paper surface, heading, tool badges, practical methods, and project-evidence link in each of four groups. Tools follow the confirmed items on [Rain’s GitHub profile](https://github.com/Rainnnee/Rainnnee); methods are grounded in the actual projects. Mathematical foundations retain an expandable list. Reading uses plain text instead of brand badges. Badge logo artwork originates from the providers used by Shields.io / Simple Icons; no tool logos were generated or imitated. Sources follow the profile README's badge URLs.

The Reading portrait is now a framed left-column image aligned with the introduction. Narrow screens center the portrait above the text. This retains the supplied golden-hour photograph and avoids an isolated floating image at the far right.

See [content.md](content.md) for adding projects, classification, real employment data, and current factual limits.

## Content-weighted proportions — October 29, 2026

Research and software are the primary reading destinations. Work now has a maximum width of 1200px, larger card headings and body text, and two illustrated research entries across on desktop. Existing software and competition groups remain separate. Redundant cover numbers and subject labels are hidden so the original vector scenes have room without competing with the titles below. Toolkit methods use a light text treatment instead of many outlined boxes.

Music remains a contrasting navy listening panel but uses a narrow editorial heading alongside both tracks, modest sleeve artwork, and compact metadata. Waveforms, seeking, genre, BPM, and key remain available. On smaller screens it stacks without hiding controls; Reading continues to omit music.

The new BruinML entry, “Rollouts Needed to Rank,” summarizes the research question from the Overleaf notes supplied by Rain, reviewed October 29. It describes evaluation-rollout sample requirements, variance, and ranking of demonstration influence. It makes no claims about Rain’s completed contributions or research results, and does not publish the private working notes. The original SVG `concepts/rollouts.svg` illustrates a robot arm, demonstration traces, possible rollout paths, and uncertainty intervals. It is conceptual vector artwork, not an empirical result or a reproduction of a figure from the notes.

Rain confirmed that the CLIP project is complete. Its period now ends in October 2026, aligned with the October 12 ALT 2027 submission deadline; the manuscript remains under review. The [official ALT 2027 schedule](https://algorithmiclearningtheory.org/alt2027/call-for-papers/) gives January 5, 2027 as author notification. A publication decision is separate from the active research period; do not imply acceptance or extend the project through that future date.

Banner-height transitions are now limited to the intro lift. Skipping the intro or switching display modes changes its height immediately, so a subsequent section jump is not displaced by a delayed banner resize. Normal blur/rise and lift timings are unchanged.

## Competition achievements

USACO is a complete gallery card before Prosperity and DataFest. The official image is from https://usaco.org/current/images/usaco_logo.png. The card crops the tree portion with CSS; the detail page shows the complete unmodified wordmark. Reading presents the 2023 Gold distinction as text.

## Project article panels

Project cards progressively enhance into a native modal dialog. The portfolio remains in place underneath, with a soft 480ms rise of 32px and a shorter 260ms close; there is no zoom, page transition, or replay of the intro. A lightly dimmed backdrop separates the ivory article column from the sky. The original vector cover opens each article in Immersive mode; Reading keeps a plain text article without the artwork. All seven standalone pages also contain their corresponding SVG cover.

The panel has its own scrolling region and an always-visible return control. Outside clicks, Escape, and browser Back dismiss it; focus and the exact portfolio scroll position return to the original link. Browser Forward reopens it. A `project` query parameter shares or reloads the panel, and “Open full page” preserves a conventional standalone alternative. Modified and middle clicks retain ordinary link behavior; without JavaScript or dialog support, project links load normal pages. Returning from a standalone project skips the homepage intro.

The panel fetches the same static article used on the standalone page, resolves relative links and images, and namespaces section IDs. No project prose or artwork is duplicated. Loading and failure states keep the return and full-page controls available. Reading suppresses the panel animation. The explicitly selected Immersive mode follows Rain’s site-wide preference to show motion, even when the browser reports reduced motion.

Panel motion follows the opening wordmark’s blur-to-clear language at a much smaller scale: a 3px blur resolves while the paper floats upward, with a 7–9px stagger for the cover and article. Nothing scales or zooms. The backdrop gently dims and softens, then clears as the panel drifts down 18px on exit. Interrupted transitions start from their current visual position; closing waits for the animation end with a short fallback, so content does not disappear mid-transition. Reading removes both the panel motion and all content staggering. Browser reduced motion is the fallback when no explicit Immersive mode is set.

## Zisheng feature and browser sampler — November 9, 2026

Zisheng leads the Machine learning shelf as an implemented conditional-model pilot. The banner is an original vector composition: a Gaussian particle cloud, smooth gathering trajectories, a conditional denoiser, and a character outline. It is a conceptual illustration, not a visualization of recorded model outputs. It contains no raster image elements or pixel-grid tiles. The 永 outline is from Noto Sans CJK SC under SIL OFL 1.1; `assets/images/concepts/NOTO-OFL.txt` retains its license. `scripts/draw-zisheng-banner.py` recreates the art from the font. No generative-image service was used.

The working model is separate, inside the Zisheng project article. A collapsible, automatically sized same-origin iframe keeps its worker lifecycle independent. Immersive opens the demo section; Reading leaves it collapsed. Closing the panel or demo disposes the iframe and inference worker. A direct demo URL also works. The runtime and checkpoint load only after Generate, never on the homepage or banner.

Default sampling now follows the source repository’s full 1,000-step DDPM posterior update, with fresh Gaussian noise at each nonfinal reverse step. It streams 101 actual states. Each Generate click selects a fresh cryptographic seed unless the visitor explicitly locks it. The faster 60/100-call DDIM samplers remain labeled alternatives; they share the weights but are not the original DDPM trajectory. Replay, timeline scrubbing, five actual checkpoint thumbnails, stop, and live-follow controls expose the process without interpolating a font into noise. The initial idle canvas is blank rather than a decorative fake noise pattern.

The ONNX export uses the public checkpoint at aff9ffde4c26000b8c1d6c1db65a73ad7059b764. Four noise-prediction cases match PyTorch within maximum absolute error 5.96e-6. `assets/models/zisheng/manifest.json` records hashes, dimensions, labels, and limitations. ONNX Runtime Web 1.31.1 is self-hosted, with MIT license and third-party notices retained. WebGPU is preferred; WebAssembly runs inference in the worker as a CPU fallback. The model is 3.6 MB; the inference binary is a larger optional first-use download. No API key, inference server, paid calls, training uploads, or telemetry is required.

Reference: the source project https://github.com/Rainnnee/zisheng; ONNX Runtime Web docs https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html; the DDIM paper https://arxiv.org/abs/2010.02502 for the optional accelerated sampler.

Seed behavior was verified in-browser: consecutive unlocked runs used different seeds; locking a seed produced pixel-identical canvas captures in two WebGPU runs. The original DDPM generated all 101 states inside the project panel. Reading-mode project detail keeps the demo collapsed; mobile checks show no horizontal overflow.

## Work categories and visual hierarchy — November 9, 2026

The former single rail obscured what the entries represented. Work now has four physically separate sections: Research, ML projects, Software projects, and Competitions & distinctions. Research describes formal studies; Machine learning contains working model projects; Software contains workflow and system builds; Competitions records event participation and attained distinctions. Research is not inferred simply from the use of ML, and an algorithmic competition remains in its event context.

The ML feature spans the content width, followed by separately labelled Research and Software shelves side by side, with a partial next card and restrained arrow controls. Their grouping is structural, not a colour filter. Competitions occupies a shorter row beneath, with all three entries visible on wide screens; USACO comes before IMC and DataFest. On phones each named section occupies a separate row and scrolls independently.

The layout keeps every SVG but removes the global artwork index, item count, repeated category labels, and “scroll to explore” instruction. ML, research, and software each have their own compact artwork-thumbnail strip, making the number and identity of projects evident without a written count. Each thumbnail jumps to its project and follows native gallery scrolling; Reading hides these controls. Category headings, independent rails, partial next cards, and arrow buttons communicate structure directly. Research uses serif study titles and visible study status; builds use clear sans-serif titles; competition captions use warm ivory and a more compact scale. Introduction and education retain their open spacing. Reading uses the same taxonomy as a continuous CV and omits gallery motion and controls.


## Editorial balance and visitor review — November 9, 2026

The visitor review found a weak hierarchy in the 2,143-pixel work block, an oversized phone-screen image in Running, and five personal interests presented with much the same card rhythm. The introduction and education were already readable, distinctive, and spacious, so their layout and photo crops were retained.

ML projects now lead with a wide, manually controlled feature panel. Zisheng is the default feature: the complete existing SVG occupies a light illustration area alongside a navy caption and a clear link to the real project/demo panel. PocketSolver occupies the same rail; there are no duplicate cards or separate feature-copy sources. Research and Software remain separately labelled supporting shelves beneath, with their own thumbnails. Competitions stays a compact final row. All original artwork and category membership are preserved. Reading uses the same source content in a complete CV list.

Gallery arrow buttons wrap at either end when the visitor requests another item. Native scrolling and Home/End remain finite; there is no autoplay, timer, vertical-scroll interception, or duplicate “infinite” content. Thumbnails show the collection and the current item directly. The feature treatment is inspired by the hierarchy of a film catalogue, without adding “trending” claims or invented project rankings.

The personal area is a two-row editorial spread. CFan is a warm theatre-program panel with a two-column credit list; SouLA has an original decorative SVG staff and beamed notes. The notes are decorative illustration, not a transcription of a particular recording. Running uses a race-bib treatment with the supplied workout time, distance and pace; the complete supplied Apple Watch image remains available through “View run record” instead of appearing as a tiny phone screen. VALORANT retains its actual rank badges and recorded update date. Chess uses a checkerboard, the supplied Lichess mark and the explicitly approximate rating. No results, affiliations, roles or dates were invented. DOM order follows the visual order for keyboard navigation.

The navigation order now matches the actual Music → Personal page order. Personal hover movement is limited to two pixels. The headline intro, fixed sky, clear-sky ending, existing portraits, and optional Reading mode are retained. All new styling lives in `assets/styles/editorial-refinement.css`; no raster-art generation or external UI library was required.

The review also found doubled anchor spacing: work-section scroll margins were added to the page’s global scroll padding. One navigation-height-based root offset now handles anchor positioning, with work-group margins cleared. This keeps clicked headings below the sticky navigation on desktop and phones without an unexplained extra gap.

At 320px, the theatre credit grid initially split Chinese play titles and the actor name across cramped lines. It now becomes a single credit column below 380px. At phone and tablet widths the chess entry becomes a compact horizontal strip, and gallery keyboard handling leaves modified browser shortcuts untouched.

## Feature proportions — November 12, 2026

The ML feature's caption spacing and forced illustration minimum height made the card taller than the SVG's natural composition. This follow-up reduces caption padding, heading size, and paragraph spacing, and removes that minimum height. The complete vector drawing retains its proportions; the phone layout still stacks artwork above text. This adjustment follows the November 9 release.
