<?php
/**
 * Site header.
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
    <div class="topbar">
        <div class="container topbar-inner">
            <span>New Jersey only</span>
            <span>Business receivables purchase funding</span>
            <span>AI Automation Audit available separately</span>
        </div>
    </div>
    <div class="container nav-shell">
        <a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="FORZA CAPITAL PARTNERS LLC home">
            <?php
            if (has_custom_logo()) {
                the_custom_logo();
            } else {
                echo forza_brand_mark();
                echo '<span><strong>FORZA</strong><small>CAPITAL PARTNERS LLC</small></span>';
            }
            ?>
        </a>
        <button class="nav-toggle" type="button" aria-controls="primary-menu" aria-expanded="false" data-nav-toggle>
            <span></span><span></span><span></span>
            <span class="screen-reader-text">Menu</span>
        </button>
        <nav class="primary-nav" id="primary-menu" aria-label="Primary navigation" data-primary-nav>
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container' => false,
                'fallback_cb' => false,
                'menu_class' => 'menu',
                'depth' => 1,
            ));
            ?>
        </nav>
        <?php echo forza_primary_cta('nav-cta'); ?>
    </div>
</header>
<main id="main">
