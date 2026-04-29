<?php
/**
 * AI Automation Audit page.
 */
get_header();
?>
<section class="page-hero">
    <div class="container page-hero-grid">
        <div>
            <p class="eyebrow">AI Automation Audit</p>
            <h1>Find the repetitive work slowing your business down.</h1>
            <p class="lede">The audit is a separate consulting offer that maps workflows, tools, handoffs, and practical AI opportunities for service businesses.</p>
        </div>
        <div class="page-media">
            <img src="<?php echo esc_url(forza_asset_url('images/forza-operations-hero.png')); ?>" alt="Tablet dashboard and business documents on a service business desk">
        </div>
    </div>
</section>

<section class="section">
    <div class="container two-column align-start">
        <div class="section-copy">
            <p class="eyebrow">Audit output</p>
            <h2>A practical map, not a vague AI pitch.</h2>
            <ul class="check-list">
                <li>Workflow and tool inventory</li>
                <li>Lead capture, follow-up, scheduling, invoicing, and reporting review</li>
                <li>Automation opportunity map by effort and ROI</li>
                <li>Prioritized recommendations for implementation</li>
                <li>Optional implementation scope after the audit</li>
            </ul>
            <p class="fine-print">AI consulting is not required for funding eligibility and does not change repayment obligations.</p>
        </div>
        <div class="form-card large">
            <?php echo forza_status_notice(); ?>
            <h2>Request an audit review</h2>
            <p>Tell FORZA where operations feel manual, slow, or easy to miss.</p>
            <?php echo forza_ai_audit_form(); ?>
        </div>
    </div>
</section>
<?php
get_footer();
