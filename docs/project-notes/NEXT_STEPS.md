# Next Steps

Start with [COMBINED_CONTEXT.md](/Users/moof/Documents/New%20project%202/COMBINED_CONTEXT.md). It combines the prior planning/build thread with this workspace's follow-up edits.

## Current State

- The package from session `019dcb0c-9d6f-7d92-b918-61d181f5ef96` was copied into this workspace.
- Missing artifacts from that prior thread were merged in without overwriting local edits.
- The workspace now contains the WordPress theme, static preview, static site export, deployment notes, docs, deal-desk tool, and zip files.
- Everything is currently untracked in git because this repo had no commits or tracked files.

## Completed Tonight

- Added stronger server-side validation for the funding and AI audit forms in `forza-capital-partners-theme/functions.php`.
- Added safer `Reply-To` headers for lead emails.
- Added an `invalid_submission` status message for incomplete or tampered form submissions.
- Added visible live values to the homepage pricing calculator in `forza-capital-partners-theme/front-page.php`.
- Added matching live calculator values to `preview/index.html`.
- Improved `forza-capital-partners-theme/assets/js/site.js` so mobile nav closes on link click/Escape, form result rendering avoids `innerHTML`, prequal results update on input, and calculator initialization guards missing elements.

## Not Finished

- CSS/mobile polish was planned but not applied yet.
- Deal Desk improvements were not started.
- The old zip files were not regenerated after the code edits.
- No PHP lint, browser preview, or responsive verification has been run yet.
- PHP is not installed in the current shell, so `php -l` is blocked until a PHP runtime is available.

## Recommended Next Pass

1. Run quick checks:
   ```bash
   php -l forza-capital-partners-theme/functions.php
   php -l forza-capital-partners-theme/front-page.php
   ```
2. Apply the visual polish pass to `forza-capital-partners-theme/assets/css/main.css`:
   - remove viewport-based font scaling,
   - clean up mobile menu selector behavior,
   - add reduced-motion support,
   - improve range output styling,
   - tighten hero/mobile spacing.
3. Improve `tools/deal-desk/`:
   - add a copyable memo summary,
   - add a revenue stress-test metric,
   - make risk notes easier to use before approval.
4. Start a local preview:
   ```bash
   python3 -m http.server 4173
   ```
   Then check:
   - `http://localhost:4173/preview/`
   - `http://localhost:4173/tools/deal-desk/`
5. Regenerate the theme and launch-kit zip files after verification.
