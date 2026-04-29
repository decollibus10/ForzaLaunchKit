<?php
/**
 * Homepage.
 */
get_header();
?>

<section class="hero">
    <div class="container hero-grid">
        <div class="hero-copy">
            <p class="eyebrow">New Jersey business funding</p>
            <h1>Working capital backed by your receivables.</h1>
            <p class="lede">FORZA CAPITAL PARTNERS LLC helps eligible New Jersey businesses access revenue-based funding through a future receivables purchase.</p>
            <div class="hero-points" aria-label="Funding highlights">
                <span>Receivables-based review</span>
                <span>$5k-$15k pilot offers</span>
                <span>AI consulting sold separately</span>
            </div>
            <div class="button-row">
                <?php echo forza_primary_cta(); ?>
                <?php echo forza_secondary_cta(); ?>
            </div>
            <p class="fine-print">Eligibility check is not approval or a commitment to fund. No sensitive documents are collected on the public form.</p>
        </div>
        <div class="hero-media">
            <img src="<?php echo esc_url(forza_asset_url('images/forza-operations-hero.png')); ?>" alt="Small business operations desk with tablet, invoices, and payment terminal">
            <div class="rate-card">
                <span>Example starting structure</span>
                <strong>1.50 factor</strong>
                <small>Eligible 30-day discount may reduce total purchased amount to 1.10x.</small>
            </div>
        </div>
    </div>
    <div class="container trust-strip">
        <div>
            <strong>NJ focused</strong>
            <span>Statewide pilot for New Jersey businesses.</span>
        </div>
        <div>
            <strong>Business only</strong>
            <span>Receivables purchase, not consumer lending.</span>
        </div>
        <div>
            <strong>Disclosure-ready</strong>
            <span>Examples and terms designed for review.</span>
        </div>
        <div>
            <strong>No COJ</strong>
            <span>No confession-of-judgment posture.</span>
        </div>
    </div>
</section>

<section class="section" id="eligibility">
    <div class="container two-column">
        <div class="section-copy">
            <p class="eyebrow">Eligibility snapshot</p>
            <h2>Built for service businesses with real receivables.</h2>
            <p>FORZA's first pilot is intentionally narrow: small advances, NJ-only geography, and businesses with enough operating history to review cash flow responsibly.</p>
            <ul class="check-list">
                <li>Based in New Jersey</li>
                <li>12+ months in business</li>
                <li>$15k+ monthly gross revenue</li>
                <li>Seeking $5k-$15k for business use</li>
                <li>First position preferred; second position reviewed carefully</li>
            </ul>
        </div>
        <div class="form-card">
            <?php echo forza_status_notice(); ?>
            <h2>Check eligibility</h2>
            <p>Tell us the basics. A human review comes before any document request or offer.</p>
            <?php echo forza_prequal_form('home'); ?>
        </div>
    </div>
</section>

<section class="section pricing-section">
    <div class="container pricing-grid">
        <div class="pricing-panel">
            <p class="eyebrow">Transparent example</p>
            <h2>See the factor-rate math before a call.</h2>
            <p>Use the calculator to understand purchased receivables at a starting 1.50 factor rate and the potential 30-day discount structure.</p>
            <div class="calculator" data-forza-calculator>
                <label>
                    <span>Advance amount</span>
                    <input type="range" min="5000" max="15000" step="1000" value="10000" data-advance-range>
                </label>
                <label>
                    <span>Factor rate</span>
                    <input type="range" min="1.50" max="1.80" step="0.05" value="1.50" data-factor-range>
                </label>
            </div>
            <p class="fine-print">Example only. Final terms depend on receivables, risk profile, existing positions, and signed agreement.</p>
        </div>
        <div class="math-card" data-calculator-output>
            <div><span>Advance</span><strong data-advance-output>$10,000</strong></div>
            <div><span>Factor rate</span><strong data-factor-output>1.50</strong></div>
            <div><span>Purchased amount</span><strong data-payback-output>$15,000</strong></div>
            <div><span>Potential 30-day discount amount</span><strong data-discount-output>$11,000</strong></div>
            <div class="highlight"><span>Potential discount savings</span><strong data-savings-output>$4,000</strong></div>
        </div>
    </div>
</section>

<section class="section">
    <div class="container process-grid">
        <div class="section-copy">
            <p class="eyebrow">How it works</p>
            <h2>A manual process, not an instant promise.</h2>
        </div>
        <ol class="steps">
            <li><strong>Pre-qualify</strong><span>Submit business basics without sensitive documents.</span></li>
            <li><strong>Review</strong><span>FORZA checks revenue, balances, existing positions, liens, and business fit.</span></li>
            <li><strong>Offer</strong><span>Eligible merchants receive counsel-reviewed terms and examples.</span></li>
            <li><strong>Service</strong><span>Remittance starts with revenue percentage or weekly ACH with reconciliation.</span></li>
        </ol>
    </div>
</section>

<section class="section ai-band">
    <div class="container ai-grid">
        <div>
            <p class="eyebrow">Separate business line</p>
            <h2>AI Automation Audit</h2>
            <p>Map repetitive work, call handling, follow-up, reporting, invoices, and scheduling into practical automation opportunities.</p>
            <ul class="check-list compact">
                <li>Workflow and tool review</li>
                <li>AI opportunity map</li>
                <li>Prioritized implementation recommendations</li>
            </ul>
        </div>
        <div class="ai-actions">
            <a class="button button-secondary" href="<?php echo esc_url(home_url('/ai-automation-audit/')); ?>">Learn about the audit <span aria-hidden="true">-></span></a>
            <p class="fine-print">Funding customers are not required to buy consulting.</p>
        </div>
    </div>
</section>

<section class="section insights-preview">
    <div class="container section-heading-row">
        <div>
            <p class="eyebrow">Insights</p>
            <h2>Weekly NJ funding education.</h2>
        </div>
        <a class="text-link" href="<?php echo esc_url(home_url('/insights/')); ?>">View all insights <span aria-hidden="true">-></span></a>
    </div>
    <div class="container post-grid">
        <?php
        $query = new WP_Query(array(
            'posts_per_page' => 3,
            'post_status' => 'publish',
        ));
        if ($query->have_posts()) :
            while ($query->have_posts()) :
                $query->the_post();
                ?>
                <article class="post-card">
                    <p class="eyebrow"><?php echo esc_html(get_the_date('M j, Y')); ?></p>
                    <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                    <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 22)); ?></p>
                </article>
                <?php
            endwhile;
            wp_reset_postdata();
        endif;
        ?>
    </div>
</section>

<?php
get_footer();
