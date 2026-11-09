# Maintaining the portfolio content

## Projects and research

Work has four visible categories, classified by the entry’s primary purpose:

- Research (`#research`): the BruinML rollout-ranking study and completed CLIP detection study. These entries ask research questions and describe study or manuscript status.
- ML projects (`#machine-learning`): Zisheng and PocketSolver. These are implemented model projects, with a pilot or evaluated scorer as the central artifact.
- Software projects (`#software`): Pusheng and the LiDAR pipeline. These entries center on a usable workflow, system, or application.
- Competitions & distinctions (`#competitions`): USACO Gold, IMC Prosperity, and ASA DataFest, in that order. An event’s context takes precedence over the tools used in it; USACO records an attained division rather than a project or medal.

Immersive leads with the ML project feature gallery, then separately labelled Research and Software shelves side by side on desktop, followed by a compact competitions row. All four headings remain visible in the document, with no filter or category tab. Each shelf scrolls independently when needed; a partial next card and arrows show continuation. There are no written collection counts or browsing instructions. ML, research, and software each have a compact thumbnail index showing every project in that section; the selected thumbnail follows scrolling and can be clicked to jump. Every original artwork stays with its entry. Phones stack the shelves vertically. Reading shows all nine entries under the same four headings as a complete CV.

To add a project, put its semantic article inside the appropriate `.work-group__cards`. Keep the stable `data-project-id`, correct `data-category`, original artwork, a concise summary, and detail-page link. Keep current work first within each group. The shelf controller discovers cards from the HTML and only shows arrows when a row overflows. Do not duplicate an entry across categories solely because it uses multiple technologies. Without JavaScript, the grouped document and anchor navigation remain visible.

Keep jobs and internships separate from these project categories. Do not add an empty group just to fill space.

USACO Gold Division (2023) appears as a competition card with the official USACO mark and its own short detail page. Rain confirmed the division and year. It records a division attainment, not a medal or specific contest rank. ACSL remains excluded.

## Jobs and internships

Professional experience is separate from the project library. There are no entries yet, so its section and navigation link remain hidden. The page already contains an inert entry template, a renderer, chronological ordering, and both-mode styling.

When an actual role is ready to publish, add an object to the `employment-data` JSON script in `index.html`. Use these fields:

| Field | Content |
| --- | --- |
| `role` | Actual position title |
| `organization` | Employer or organization name |
| `period` | Display date range |
| `startDate` | ISO start date (`YYYY-MM` or `YYYY-MM-DD`); roles sort newest first |
| `highlights` | Array of factual contribution statements |
| `url` | Optional public role or organization URL |

The renderer uses text nodes and restricts optional links to HTTP(S). Do not put a planned internship, project affiliation, CFan, or SouLA into employment to fill space. Real work appears between Education and Projects. Keep role descriptions factual and independently reviewable.

## Toolkit

Toolkit uses one consistent component for Programming, Statistics & data, Machine learning, and Development & publishing. Each group lists tools, practical methods, and a link to an actual project as evidence. Keep capabilities grounded in the linked work or Rain’s supplied profile; no proficiency percentages or invented levels. PyTorch is supported by the implemented Zisheng and MiniLM work. Mathematical foundations have a separate expandable list.

Tool badges are local copies of the Shields.io assets used in Rain’s GitHub profile. Preserve their labels and logos. Sources are the badge URLs in `Rainnnee/Rainnnee`’s README; local hosting avoids runtime badge-service requests. Reading presents tools and methods as plain text without the decorative surfaces or project cross-links.

## Pusheng / PDF to MIDI

The entry is based on the local `MIDI Scanner` repository's README and project status report, reviewed October 27, 2026. The offline recognition/evaluation work exists; the musician-facing upload/review application remains in development. Do not describe the interface, expressive playback, or general-purpose recognition reliability as shipped.

The confirmed repository URL is `https://github.com/Rainnnee/pdf-to-midi`. It is labeled “not public yet” on the detail page, so visitors are told before following a restricted or unavailable link. Do not change repository visibility from the website task.

## BruinML research entries

Research has two separate entries. The CLIP-based detection work is completed (2026 through October 2026), with its ALT 2027 manuscript still under review. The Fall 2026 demonstration-ranking project is ongoing. Its public description is limited to the research question and intended direction; add individual contributions or results only when Rain provides them. Keep the private Overleaf notes out of the website repository.

## Project reading behavior

Keep the detail content in `projects/*.html`; homepage panels import that article, so edits appear in both places. Each detail article begins with `.project-detail__art` containing the matching local concept SVG and descriptive alt text. Homepage project URLs remain real relative links and provide the fallback without JavaScript. The panel derives its allowlist from these links. Do not replace the links with click-only cards or copy project prose into JavaScript.

## Resume reconciliation — November 9, 2026

Reviewed all five current v3.13.0 resume sources (General, ML, SWE, Data Analytics, Club), the supporting methods/evidence notes, and the Zisheng Planning and Dev chats. Preserve the distinction between completed experiments, team results, development evaluation, and proposed work.

- Education now uses expected June 2028, the Computing specialization, GPA 3.983/4.00, and the expanded coursework.
- CLIP: three personal Monte Carlo studies, a 225-configuration sweep, clipping relative to the original unclipped scan, uncertainty estimates, and three manuscript figures. The 19.9%→97.7% result is one Gaussian-mixture simulation at a 5% false-positive target. The ALT 2027 manuscript is submitted, not accepted. The individual CLIP project ended in October; the BruinML affiliation continues through the separate ranking project.
- PocketSolver: personal paired-input MiniLM scorer and wrapper contribution. Audited source size 563,200; development modeling pool 10,000. Five-fold scenario-grouped CV gave 65.20% accuracy and log loss 0.713931 versus linear 69.69% and 1.002538. A 28.8% loss reduction is not an accuracy improvement or official final-test result. Keep the unpolished team demo URL off the page, as requested in the resume work.
- DataFest: patient-level aggregation, care-gap features, Spearman/BH, cohort tests, exploratory age-bin-adjusted logistic models, and reporting/presentation. No proprietary records or unpublished clinical coefficients are included.
- Prosperity: all five rounds, 20+ backtest variants, event-driven state, options, flow, and pair/basket methods. Top 16% describes qualification, not final standings; no profitability claim.
- Zisheng leads Machine learning as an ongoing Honors visual pilot. It is not a completed recognition or generalization study. Existing older software entries remain as portfolio history.

Reading mode expands supported project work into professional bullets; Immersive keeps shorter summaries. Technical skills now reflect the tools actually used in the updated resumes, including PyTorch, Transformers, SciPy, Matplotlib, R data-wrangling packages, and R Markdown.

## Browsing behavior — November 9, 2026

Each visible category has its own rail. Native swipe/trackpad scrolling, previous/next buttons, and focused-gallery arrow keys or Home/End operate only that row. Arrow navigation wraps at the ends; native scrolling and Home/End remain finite. Nothing auto-advances or intercepts vertical scrolling. Detail panels preserve each row’s position when closed. Reading retains the complete grouped list without gallery controls.
