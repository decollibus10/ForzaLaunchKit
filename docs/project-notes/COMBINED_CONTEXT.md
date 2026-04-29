# Combined Context

## Source Threads

- Prior planning/build thread: `019dcb0c-9d6f-7d92-b918-61d181f5ef96`
- Current workspace thread: copied and continued from that prior thread in `/Users/moof/Documents/New project 2`
- Original prior workspace: `/Users/moof/Documents/Codex/2026-04-26/lets-plan-a-website-and-business`

## Business Direction

- Business/legal brand: **FORZA CAPITAL PARTNERS LLC**
- Entity details from the formation certificate used in the prior plan:
  - New Jersey filing date: January 10, 2026
  - Entity ID: 0451396744
- Business model:
  - NJ-only launch.
  - Owner-funded business receivables purchase / revenue-based funding.
  - Separate AI Automation Audit consulting offer.
  - No consumer lending positioning.
  - No broker marketplace at launch.
- Initial funding box:
  - New Jersey businesses only.
  - 12+ months in business.
  - $15k+ monthly gross revenue.
  - $5k-$15k first funding requests.
  - First position preferred; second position only with careful review.
- Pricing language:
  - Public examples can show a 1.50 factor rate.
  - Eligible 30-day discount example can show a reduced 1.10 total purchased amount.
  - All examples must say final terms depend on underwriting and signed agreement.
- Compliance posture:
  - Use receivables-purchase language carefully.
  - Avoid "guaranteed approval" and consumer-loan phrasing.
  - Public forms should not collect SSNs, bank logins, statements, or contracts.
  - Counsel must review contracts, disclosures, ads, privacy language, servicing, and collections before funding deals.
  - Do not publish member home addresses from the formation certificate.

## What Was Built In The Prior Thread

- WordPress classic theme in `forza-capital-partners-theme/`.
- Uploadable WordPress theme zip: `forza-capital-partners-theme.zip`.
- Static preview: `preview/index.html`.
- Static site export: `static-site/`.
- Static site zip: `forza-capital-partners-static-site.zip`.
- Launch kit zip: `forza-capital-partners-launch-kit.zip`.
- Deployment notes:
  - `deploy/README.md`
  - `deploy/cloudflare-pages.md`
  - `deploy/hubspot-forms.md`
  - `deploy/.env.example`
- Internal Deal Desk tool:
  - `tools/deal-desk/index.html`
  - `tools/deal-desk/styles.css`
  - `tools/deal-desk/app.js`
- Static site build script: `tools/build-static-site.mjs`
- Operational docs under `docs/`, including:
  - Launch checklist
  - Underwriting playbook
  - Compliance counsel packet
  - Counsel review questions
  - Contract terms issue list
  - CRM pipeline and import templates
  - Meta ad launch kit
  - SEO briefs, content calendar, and starter SEO articles
  - Lead-generation engine
  - HubSpot lead-capture fields
  - UTM tracking map
  - Funding-day checklist
  - Portfolio allocation model
  - Servicing/reconciliation log
  - Document retention/security policy

## What Happened In This Workspace

- The prior package was copied into `/Users/moof/Documents/New project 2`.
- Additional missing prior-thread artifacts were merged into this workspace without overwriting existing files.
- Current repo has no commits yet; all project files are untracked.
- Current local edits already made after the copy:
  - `forza-capital-partners-theme/functions.php`
    - Theme version bumped to `1.1.0`.
    - Added centralized select-option helpers.
    - Added stronger server-side validation for funding and AI audit forms.
    - Added allowed-value checks for select fields.
    - Added safer `Reply-To` headers for lead notification emails.
    - Added `invalid_submission` status message.
  - `forza-capital-partners-theme/front-page.php`
    - Added live visible output labels for pricing calculator sliders.
  - `preview/index.html`
    - Added matching live visible output labels for pricing calculator sliders.
  - `forza-capital-partners-theme/assets/js/site.js`
    - Mobile nav closes on link click and Escape.
    - Eligibility result rendering avoids `innerHTML`.
    - Prequal feedback updates on input and change.
    - Calculator init now guards missing elements.
  - `NEXT_STEPS.md`
    - Handoff note from the previous night.
  - `COMBINED_CONTEXT.md`
    - This file.

## Verification Status

- PHP lint was attempted in this workspace, but `php` is not installed:
  - `zsh:1: command not found: php`
- Browser/static verification has not been completed in this current workspace after the latest edits.
- Old zip files have not been regenerated after the local edits in this workspace.

## Recommended Next Work

1. Decide whether the WordPress theme or static site is the primary deployment target.
2. Finish CSS/mobile polish in `forza-capital-partners-theme/assets/css/main.css`:
   - remove viewport-width font scaling,
   - fix mobile menu selector so preview menu styles only change when open,
   - add/confirm reduced-motion behavior,
   - style calculator range output labels,
   - tighten hero spacing and mobile layout.
3. Improve the Deal Desk:
   - add copyable memo summary,
   - add revenue stress-test metric,
   - make risk notes easier to paste into an approval memo.
4. Run local static preview:
   ```bash
   python3 -m http.server 4173
   ```
   Check:
   - `http://localhost:4173/preview/`
   - `http://localhost:4173/tools/deal-desk/`
   - `http://localhost:4173/static-site/`
5. Run browser verification for:
   - desktop and mobile homepage,
   - pricing calculator,
   - eligibility result states,
   - mobile nav,
   - Deal Desk calculations and print/copy workflow.
6. Regenerate zips after verification:
   - theme zip,
   - static-site zip,
   - full launch-kit zip.
7. If PHP is needed locally, install or use a PHP-capable environment, then run:
   ```bash
   php -l forza-capital-partners-theme/functions.php
   php -l forza-capital-partners-theme/front-page.php
   ```
