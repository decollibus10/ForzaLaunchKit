<?php
/**
 * Single post template.
 */
get_header();
?>
<?php
while (have_posts()) :
    the_post();
    ?>
    <article>
        <section class="page-hero">
            <div class="container narrow">
                <p class="eyebrow"><?php echo esc_html(get_the_date('M j, Y')); ?></p>
                <h1><?php the_title(); ?></h1>
                <p class="lede"><?php echo esc_html(wp_trim_words(get_the_excerpt(), 28)); ?></p>
            </div>
        </section>
        <section class="section">
            <div class="container prose">
                <?php the_content(); ?>
                <hr>
                <p><strong>Important:</strong> This article is educational. Eligibility review is not approval, and FORZA does not offer consumer loans.</p>
                <p><a class="button button-primary" href="<?php echo esc_url(home_url('/eligibility/')); ?>">Check eligibility <span aria-hidden="true">-></span></a></p>
            </div>
        </section>
    </article>
    <?php
endwhile;
get_footer();
