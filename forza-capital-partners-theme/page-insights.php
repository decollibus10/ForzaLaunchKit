<?php
/**
 * Insights page.
 */
get_header();
?>
<section class="page-hero">
    <div class="container narrow">
        <p class="eyebrow">Insights</p>
        <h1>NJ funding education for business owners.</h1>
        <p class="lede">Weekly content should help owners understand receivables purchases, factor rates, reconciliation, and when this type of funding is not the right fit.</p>
    </div>
</section>

<section class="section">
    <div class="container post-grid wide">
        <?php
        $query = new WP_Query(array(
            'posts_per_page' => 12,
            'post_status' => 'publish',
        ));

        if ($query->have_posts()) :
            while ($query->have_posts()) :
                $query->the_post();
                ?>
                <article class="post-card">
                    <p class="eyebrow"><?php echo esc_html(get_the_date('M j, Y')); ?></p>
                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 28)); ?></p>
                    <a class="text-link" href="<?php the_permalink(); ?>">Read article <span aria-hidden="true">-></span></a>
                </article>
                <?php
            endwhile;
            wp_reset_postdata();
        else :
            ?>
            <p>No insights are published yet.</p>
            <?php
        endif;
        ?>
    </div>
</section>

<section class="section muted">
    <div class="container two-column">
        <div>
            <p class="eyebrow">90-day content plan</p>
            <h2>Publish one useful article per week.</h2>
        </div>
        <ul class="content-list">
            <li>MCA basics for New Jersey business owners</li>
            <li>Revenue-based funding vs. bank loans</li>
            <li>Factor rates and total purchased amount examples</li>
            <li>How reconciliation should work</li>
            <li>Second-position funding risks</li>
            <li>Funding guides for contractors, restaurants, salons, repair shops, and local services</li>
        </ul>
    </div>
</section>
<?php
get_footer();
