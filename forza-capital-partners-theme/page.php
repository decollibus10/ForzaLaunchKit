<?php
/**
 * Default page template.
 */
get_header();
?>
<section class="page-hero">
    <div class="container narrow">
        <p class="eyebrow">FORZA CAPITAL PARTNERS LLC</p>
        <h1><?php the_title(); ?></h1>
        <?php echo forza_status_notice(); ?>
    </div>
</section>
<section class="section">
    <div class="container prose">
        <?php
        while (have_posts()) :
            the_post();
            the_content();
            if (trim(get_the_content()) === '') :
                ?>
                <p>Thanks for reaching out. A member of the FORZA team can review the submission and follow up with next steps.</p>
                <p><?php echo esc_html__('Eligibility review is not approval or a commitment to fund.', 'forza-capital-partners'); ?></p>
                <?php
            endif;
        endwhile;
        ?>
    </div>
</section>
<?php
get_footer();
