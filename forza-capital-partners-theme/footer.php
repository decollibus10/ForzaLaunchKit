<?php
/**
 * Site footer.
 */
?>
</main>
<footer class="site-footer">
    <div class="container footer-grid">
        <div>
            <a class="brand footer-brand" href="<?php echo esc_url(home_url('/')); ?>">
                <?php echo forza_brand_mark(); ?>
                <span><strong>FORZA</strong><small>CAPITAL PARTNERS LLC</small></span>
            </a>
            <p>NJ-only business receivables purchase funding and separate AI Automation Audit consulting.</p>
            <p class="footer-small">Entity ID 0451396744. Filed in New Jersey on January 10, 2026.</p>
        </div>
        <div>
            <h2>Funding</h2>
            <a href="<?php echo esc_url(home_url('/business-funding/')); ?>">Business Funding</a>
            <a href="<?php echo esc_url(home_url('/eligibility/')); ?>">Eligibility</a>
            <a href="<?php echo esc_url(home_url('/how-it-works/')); ?>">How It Works</a>
            <a href="<?php echo esc_url(home_url('/disclosures/')); ?>">Disclosures</a>
        </div>
        <div>
            <h2>Company</h2>
            <a href="<?php echo esc_url(home_url('/about/')); ?>">About</a>
            <a href="<?php echo esc_url(home_url('/ai-automation-audit/')); ?>">AI Automation Audit</a>
            <a href="<?php echo esc_url(home_url('/insights/')); ?>">Insights</a>
            <a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a>
        </div>
        <div>
            <h2>Important</h2>
            <a href="<?php echo esc_url(home_url('/privacy/')); ?>">Privacy Policy</a>
            <a href="<?php echo esc_url(home_url('/terms/')); ?>">Terms of Use</a>
            <p class="footer-small">Eligibility review is not approval. FORZA does not offer consumer loans.</p>
        </div>
    </div>
    <div class="container legal-line">
        <p>&copy; <?php echo esc_html(date_i18n('Y')); ?> FORZA CAPITAL PARTNERS LLC. All rights reserved.</p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
