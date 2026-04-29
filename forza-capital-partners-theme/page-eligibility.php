<?php
/**
 * Eligibility page.
 */
get_header();
?>
<section class="page-hero">
    <div class="container narrow">
        <p class="eyebrow">Check eligibility</p>
        <h1>Start with a short business-only pre-qual form.</h1>
        <p class="lede">No SSNs, bank logins, statements, or contracts are collected here. If the basics fit, FORZA can request documents through a secure review process.</p>
    </div>
</section>

<section class="section">
    <div class="container two-column align-start">
        <aside class="sidebar-panel">
            <h2>Current pilot rules</h2>
            <ul class="check-list">
                <li>New Jersey businesses only</li>
                <li>12+ months in business</li>
                <li>$15k+ monthly gross revenue</li>
                <li>$5k-$15k first funding requests</li>
                <li>First position preferred</li>
            </ul>
            <p class="fine-print">Second-position files and larger requests are routed to manual review.</p>
        </aside>
        <div class="form-card large">
            <?php echo forza_status_notice(); ?>
            <h2>Business funding eligibility</h2>
            <p>Answer the basics below. This is not approval, underwriting, or a funding commitment.</p>
            <?php echo forza_prequal_form('full'); ?>
        </div>
    </div>
</section>
<?php
get_footer();
