<?php
/**
 * Contact page.
 */
get_header();
?>
<section class="page-hero">
    <div class="container narrow">
        <p class="eyebrow">Contact</p>
        <h1>Start with the right review path.</h1>
        <p class="lede">Use the funding eligibility form for receivables-purchase review, or the AI Automation Audit form for consulting.</p>
    </div>
</section>

<section class="section">
    <div class="container two-column align-start">
        <div class="form-card large">
            <?php echo forza_status_notice(); ?>
            <h2>Funding eligibility</h2>
            <?php echo forza_prequal_form('contact'); ?>
        </div>
        <div class="form-card large">
            <h2>AI Automation Audit</h2>
            <?php echo forza_ai_audit_form(); ?>
        </div>
    </div>
</section>
<?php
get_footer();
