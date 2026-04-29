<?php
/**
 * Business Funding page.
 */
get_header();
?>
<section class="page-hero">
    <div class="container page-hero-grid">
        <div>
            <p class="eyebrow">Business funding</p>
            <h1>Revenue-based funding for eligible NJ businesses.</h1>
            <p class="lede">FORZA purchases a portion of future receivables from qualified New Jersey businesses. The structure is built for business cash flow, not consumer lending.</p>
            <div class="button-row">
                <?php echo forza_primary_cta(); ?>
                <a class="button button-secondary" href="<?php echo esc_url(home_url('/disclosures/')); ?>">Read disclosures</a>
            </div>
        </div>
        <div class="page-media">
            <img src="<?php echo esc_url(forza_asset_url('images/forza-operations-hero.png')); ?>" alt="Business desk with receivables documents and tablet">
        </div>
    </div>
</section>

<section class="section">
    <div class="container three-grid">
        <article class="info-card">
            <h2>Who it is for</h2>
            <p>NJ service businesses with 12+ months operating history, $15k+ monthly gross revenue, and a business use for $5k-$15k in working capital.</p>
        </article>
        <article class="info-card">
            <h2>How offers start</h2>
            <p>Base offers may start at a 1.50 factor rate, with terms depending on receivables, balances, existing positions, risk profile, and final agreement.</p>
        </article>
        <article class="info-card">
            <h2>How remittance works</h2>
            <p>FORZA prioritizes revenue-percentage remittance, then weekly ACH with reconciliation, and uses daily fixed ACH only where risk warrants it.</p>
        </article>
    </div>
</section>

<section class="section muted">
    <div class="container two-column">
        <div>
            <p class="eyebrow">Position policy</p>
            <h2>First position preferred. Second position reviewed carefully.</h2>
            <p>FORZA prefers to be first position. Second-position files may be reviewed only when the senior lender is top-tier and cash flow supports both obligations.</p>
        </div>
        <div>
            <p class="eyebrow">Contract posture</p>
            <h2>Performance guaranty, no confession of judgment.</h2>
            <p>The intended security posture is focused on truthful reporting, cooperation, and performance obligations, with no confession-of-judgment approach.</p>
        </div>
    </div>
</section>

<?php
get_footer();
