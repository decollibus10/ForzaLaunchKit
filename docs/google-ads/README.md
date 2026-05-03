# FORZA Google Ads Launch Pack

## Launch Blockers

Do not turn spend on until these are filled:

- Add a compliant public physical business address to the app. Do not use the owner home address unless counsel says it is necessary.
- Use `https://forza-funding.com` as the live production domain once DNS is connected.
- Add Google conversion IDs/labels to production env vars.
- Counsel reviews the ad copy, landing pages, broker disclosure, fees, and NJ commercial-financing obligations.

Google requires financial-products/service landing pages to show the physical business address and all associated fees clearly without click or hover. Source: https://support.google.com/adspolicy/answer/2464998

## Starting Budget

- Total Google launch budget: `$70/day`.
- Run for 14 days before judging.
- Search network only. Do not include Display Network in v1.
- Location: New Jersey.
- Language: English.
- Starting bid strategy: Maximize Clicks with a CPC cap around `$8-$12`.
- Switch to Maximize Conversions after conversion tracking is verified and the account has enough lead data.

## Campaigns

1. `forza_google_nj_compare_mca_search_2026q2`
   - Budget: `$35/day`
   - Landing page: `/funnels/compare-mca-offers-nj`
   - Intent: merchants comparing offers before signing

2. `forza_google_nj_second_opinion_search_2026q2`
   - Budget: `$20/day`
   - Landing page: `/funnels/mca-second-opinion-nj`
   - Intent: merchants with a broker/funder offer already in hand

3. `forza_google_nj_factor_rate_search_2026q2`
   - Budget: `$15/day`
   - Landing page: `/funnels/factor-rate-calculator-nj`
   - Intent: calculator and offer-math research leads

## Conversion Actions

Map these app events to Google Ads conversion actions:

- `lead_submitted`
- `dashboard_started`
- `calculator_lead`

Production env vars:

```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_LEAD_CONVERSION_LABEL=
NEXT_PUBLIC_GOOGLE_DASHBOARD_START_CONVERSION_LABEL=
NEXT_PUBLIC_GOOGLE_CALCULATOR_LEAD_CONVERSION_LABEL=
```

## Manual Launch Steps

1. Create the three Search campaigns above.
2. Set location to New Jersey only.
3. Disable Search Partners and Display Network for the first test.
4. Add keywords from `keywords.csv`.
5. Add negative keywords from `negative-keywords.csv`.
6. Build responsive search ads from `responsive-search-ads.csv`.
7. Add sitelinks and callouts from `assets.csv`.
8. Use final URLs from `final-urls.csv` after replacing `{LIVE_DOMAIN}`.
9. Submit ads paused.
10. Verify landing pages load, disclosures are visible, and conversions fire.
11. Turn on Campaign 1 first. Turn on the other two after one clean test conversion.

## First 72-Hour Rules

- Pause any keyword with spend above `$40` and zero form starts.
- Add search terms as negatives if they are consumer loans, credit repair, debt, payday, crypto, mortgage, or personal hardship traffic.
- Do not judge quality by lead volume alone. Score leads by whether they already have an MCA offer or active MCA position.
- Keep ad copy centered on comparison, dashboard transparency, and offer review.
