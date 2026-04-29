<?php
/**
 * Blog index fallback.
 */
get_header();
?>
<section class="page-hero">
    <div class="container narrow">
        <p class="eyebrow">Insights</p>
        <h1>Funding education for NJ business owners.</h1>
    </div>
</section>
<section class="section">
    <div class="container post-grid wide">
        <?php
        if (have_posts()) :
            while (have_posts()) :
                the_post();
                ?>
                <article class="post-card">
                    <p class="eyebrow"><?php echo esc_html(get_the_date('M j, Y')); ?></p>
                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 30)); ?></p>
                </article>
                <?php
            endwhile;
        else :
            echo '<p>No posts found.</p>';
        endif;
        ?>
    </div>
</section>
<?php
get_footer();
