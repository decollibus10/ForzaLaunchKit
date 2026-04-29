<?php
/**
 * FORZA CAPITAL PARTNERS LLC theme functions.
 *
 * This theme intentionally keeps public intake lightweight. Sensitive documents
 * should be requested only after a human review through a secure channel.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FORZA_THEME_VERSION', '1.0.0');

function forza_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('custom-logo', array(
        'height' => 72,
        'width' => 260,
        'flex-height' => true,
        'flex-width' => true,
    ));

    register_nav_menus(array(
        'primary' => __('Primary Menu', 'forza-capital-partners'),
        'footer' => __('Footer Menu', 'forza-capital-partners'),
    ));
}
add_action('after_setup_theme', 'forza_setup');

function forza_assets(): void
{
    wp_enqueue_style(
        'forza-main',
        get_template_directory_uri() . '/assets/css/main.css',
        array(),
        FORZA_THEME_VERSION
    );

    wp_enqueue_script(
        'forza-site',
        get_template_directory_uri() . '/assets/js/site.js',
        array(),
        FORZA_THEME_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'forza_assets');

function forza_asset_url(string $path): string
{
    return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
}

function forza_brand_mark(): string
{
    return '<span class="brand-mark" aria-hidden="true">'
        . '<svg viewBox="0 0 64 64" role="img" focusable="false">'
        . '<path d="M32 6 56 20v24L32 58 8 44V20L32 6Z" fill="currentColor" opacity=".16"/>'
        . '<path d="M32 10 52 22 32 34 12 22 32 10Z" fill="currentColor"/>'
        . '<path d="M20 28h28L32 54h-9l11-18H20v-8Z" fill="#fff"/>'
        . '<path d="M34 26 46 19v16H34v-9Z" fill="#fff" opacity=".9"/>'
        . '</svg>'
        . '</span>';
}

function forza_primary_cta(string $class = ''): string
{
    return sprintf(
        '<a class="button button-primary %s" href="%s">Check eligibility <span aria-hidden="true">-></span></a>',
        esc_attr($class),
        esc_url(home_url('/eligibility/'))
    );
}

function forza_secondary_cta(string $class = ''): string
{
    return sprintf(
        '<a class="button button-secondary %s" href="%s">How it works</a>',
        esc_attr($class),
        esc_url(home_url('/how-it-works/'))
    );
}

function forza_select_options(string $name, array $options, string $label, string $placeholder = 'Select one'): string
{
    $required = 'required';
    $html = '<label><span>' . esc_html($label) . '</span><select name="' . esc_attr($name) . '" ' . $required . '>';
    $html .= '<option value="">' . esc_html($placeholder) . '</option>';
    foreach ($options as $value => $text) {
        $html .= '<option value="' . esc_attr($value) . '">' . esc_html($text) . '</option>';
    }
    $html .= '</select></label>';

    return $html;
}

function forza_prequal_form(string $variant = 'default'): string
{
    ob_start();
    ?>
    <form class="forza-form prequal-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" data-forza-prequal>
        <input type="hidden" name="action" value="forza_prequal">
        <input type="hidden" name="utm_source" value="">
        <input type="hidden" name="utm_medium" value="">
        <input type="hidden" name="utm_campaign" value="">
        <?php wp_nonce_field('forza_prequal', 'forza_nonce'); ?>
        <label class="forza-honeypot">Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>

        <div class="form-grid">
            <label><span>Business legal name</span><input type="text" name="business_name" placeholder="Your registered business name" required></label>
            <label><span>Owner name</span><input type="text" name="owner_name" placeholder="First and last name" required></label>
            <label><span>Business email</span><input type="email" name="email" placeholder="you@business.com" required></label>
            <label><span>Phone number</span><input type="tel" name="phone" placeholder="(732) 555-0123" required></label>
            <?php
            echo forza_select_options('business_state', array(
                'NJ' => 'New Jersey',
                'other' => 'Outside New Jersey',
            ), 'Business location');
            echo forza_select_options('industry', array(
                'contractor' => 'Contractor / trades',
                'restaurant' => 'Restaurant / food service',
                'salon' => 'Salon / wellness',
                'repair' => 'Repair / auto / service shop',
                'professional' => 'Professional services',
                'other' => 'Other local service business',
            ), 'Industry');
            echo forza_select_options('monthly_revenue', array(
                'under-15' => 'Under $15k/month',
                '15-25' => '$15k-$25k/month',
                '25-50' => '$25k-$50k/month',
                '50-plus' => '$50k+/month',
            ), 'Monthly gross revenue');
            echo forza_select_options('time_in_business', array(
                'under-12' => 'Under 12 months',
                '12-24' => '12-24 months',
                '24-plus' => '24+ months',
            ), 'Time in business');
            echo forza_select_options('desired_funding', array(
                '5-15' => '$5k-$15k',
                '15-35' => '$15k-$35k',
                '35-plus' => '$35k+',
            ), 'Funding amount');
            echo forza_select_options('existing_positions', array(
                'none' => 'No active advance',
                'top-tier' => 'One position with a top-tier lender',
                'stacked' => 'Multiple active advances',
                'unknown' => 'Not sure',
            ), 'Existing funding');
            ?>
            <label class="form-span"><span>Use of funds</span><textarea name="use_of_funds" rows="4" placeholder="Payroll, inventory, equipment, receivables gap, marketing, repairs..." required></textarea></label>
        </div>

        <label class="consent-line">
            <input type="checkbox" name="consent" value="1" required>
            <span>I understand this is a business funding eligibility review for NJ businesses, not a guarantee of approval or a commitment to fund.</span>
        </label>

        <div class="form-actions">
            <button class="button button-primary" type="submit">Check eligibility <span aria-hidden="true">-></span></button>
            <p class="form-note">No SSNs, bank logins, or statements are collected on this form.</p>
        </div>

        <div class="eligibility-result" data-forza-result aria-live="polite"></div>
    </form>
    <?php
    return ob_get_clean();
}

function forza_ai_audit_form(): string
{
    ob_start();
    ?>
    <form class="forza-form audit-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="forza_ai_audit">
        <?php wp_nonce_field('forza_ai_audit', 'forza_nonce'); ?>
        <label class="forza-honeypot">Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>

        <div class="form-grid">
            <label><span>Business name</span><input type="text" name="business_name" placeholder="Your business" required></label>
            <label><span>Your name</span><input type="text" name="owner_name" placeholder="First and last name" required></label>
            <label><span>Email</span><input type="email" name="email" placeholder="you@business.com" required></label>
            <label><span>Phone</span><input type="tel" name="phone" placeholder="(732) 555-0123" required></label>
            <?php
            echo forza_select_options('audit_focus', array(
                'front-desk' => 'Calls, scheduling, and follow-up',
                'finance' => 'Invoices, payments, and reporting',
                'sales' => 'Lead capture and sales workflow',
                'ops' => 'Operations and admin work',
                'unknown' => 'Help me find the best opportunities',
            ), 'Automation focus');
            echo forza_select_options('team_size', array(
                '1-5' => '1-5 people',
                '6-20' => '6-20 people',
                '21-plus' => '21+ people',
            ), 'Team size');
            ?>
            <label class="form-span"><span>What should the audit look at?</span><textarea name="goals" rows="4" placeholder="Describe repetitive work, bottlenecks, or tools you already use." required></textarea></label>
        </div>

        <div class="form-actions">
            <button class="button button-primary" type="submit">Request audit review <span aria-hidden="true">-></span></button>
            <p class="form-note">This is separate from funding eligibility and is not required for funding customers.</p>
        </div>
    </form>
    <?php
    return ob_get_clean();
}

function forza_clean_post_value(string $key): string
{
    return isset($_POST[$key]) ? sanitize_text_field(wp_unslash($_POST[$key])) : '';
}

function forza_clean_textarea(string $key): string
{
    return isset($_POST[$key]) ? sanitize_textarea_field(wp_unslash($_POST[$key])) : '';
}

function forza_redirect_with_status(string $status): void
{
    $fallback = home_url('/thank-you/');
    $referer = wp_get_referer();
    wp_safe_redirect(add_query_arg('forza_status', rawurlencode($status), $referer ?: $fallback));
    exit;
}

function forza_prequal_status(array $data): string
{
    if (($data['business_state'] ?? '') !== 'NJ') {
        return 'outside_nj';
    }

    if (($data['monthly_revenue'] ?? '') === 'under-15' || ($data['time_in_business'] ?? '') === 'under-12') {
        return 'not_prequalified';
    }

    if (($data['desired_funding'] ?? '') !== '5-15' || in_array(($data['existing_positions'] ?? ''), array('stacked', 'unknown'), true)) {
        return 'manual_review';
    }

    return 'pilot_fit';
}

function forza_handle_prequal_submission(): void
{
    if (!empty($_POST['website'])) {
        forza_redirect_with_status('received');
    }

    if (!isset($_POST['forza_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['forza_nonce'])), 'forza_prequal')) {
        forza_redirect_with_status('security_error');
    }

    $data = array(
        'business_name' => forza_clean_post_value('business_name'),
        'owner_name' => forza_clean_post_value('owner_name'),
        'email' => sanitize_email(forza_clean_post_value('email')),
        'phone' => forza_clean_post_value('phone'),
        'business_state' => forza_clean_post_value('business_state'),
        'industry' => forza_clean_post_value('industry'),
        'monthly_revenue' => forza_clean_post_value('monthly_revenue'),
        'time_in_business' => forza_clean_post_value('time_in_business'),
        'desired_funding' => forza_clean_post_value('desired_funding'),
        'existing_positions' => forza_clean_post_value('existing_positions'),
        'use_of_funds' => forza_clean_textarea('use_of_funds'),
        'utm_source' => forza_clean_post_value('utm_source'),
        'utm_medium' => forza_clean_post_value('utm_medium'),
        'utm_campaign' => forza_clean_post_value('utm_campaign'),
    );

    $status = forza_prequal_status($data);
    $body = "New FORZA funding pre-qualification lead\n\n";
    foreach ($data as $label => $value) {
        $body .= ucwords(str_replace('_', ' ', $label)) . ': ' . $value . "\n";
    }
    $body .= "\nInitial status: " . $status . "\n";
    $body .= "Reminder: request bank statements, existing contracts, and sensitive documents only after human review through a secure channel.\n";

    wp_mail(get_option('admin_email'), 'New FORZA funding prequal: ' . $data['business_name'], $body);
    forza_redirect_with_status($status);
}
add_action('admin_post_nopriv_forza_prequal', 'forza_handle_prequal_submission');
add_action('admin_post_forza_prequal', 'forza_handle_prequal_submission');

function forza_handle_ai_audit_submission(): void
{
    if (!empty($_POST['website'])) {
        forza_redirect_with_status('audit_received');
    }

    if (!isset($_POST['forza_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['forza_nonce'])), 'forza_ai_audit')) {
        forza_redirect_with_status('security_error');
    }

    $data = array(
        'business_name' => forza_clean_post_value('business_name'),
        'owner_name' => forza_clean_post_value('owner_name'),
        'email' => sanitize_email(forza_clean_post_value('email')),
        'phone' => forza_clean_post_value('phone'),
        'audit_focus' => forza_clean_post_value('audit_focus'),
        'team_size' => forza_clean_post_value('team_size'),
        'goals' => forza_clean_textarea('goals'),
    );

    $body = "New FORZA AI Automation Audit lead\n\n";
    foreach ($data as $label => $value) {
        $body .= ucwords(str_replace('_', ' ', $label)) . ': ' . $value . "\n";
    }
    $body .= "\nFunding purchase is not required for AI consulting.\n";

    wp_mail(get_option('admin_email'), 'New FORZA AI audit request: ' . $data['business_name'], $body);
    forza_redirect_with_status('audit_received');
}
add_action('admin_post_nopriv_forza_ai_audit', 'forza_handle_ai_audit_submission');
add_action('admin_post_forza_ai_audit', 'forza_handle_ai_audit_submission');

function forza_status_notice(): string
{
    if (empty($_GET['forza_status'])) {
        return '';
    }

    $status = sanitize_text_field(wp_unslash($_GET['forza_status']));
    $messages = array(
        'pilot_fit' => 'Thanks. Based on the basics, this looks like a strong pilot fit. A human review comes next before any offer.',
        'manual_review' => 'Thanks. Your file needs a manual review because of the amount requested or existing funding position.',
        'not_prequalified' => 'Thanks. Based on the current pilot rules, this may not fit yet. We will still review your details.',
        'outside_nj' => 'Thanks. FORZA is currently focused on New Jersey businesses only.',
        'received' => 'Thanks. Your submission was received.',
        'audit_received' => 'Thanks. Your AI Automation Audit request was received.',
        'security_error' => 'The form could not be verified. Please refresh the page and try again.',
    );

    if (!isset($messages[$status])) {
        return '';
    }

    return '<div class="status-notice" role="status">' . esc_html($messages[$status]) . '</div>';
}

function forza_json_ld(): void
{
    $schema = array(
        '@context' => 'https://schema.org',
        '@type' => array('Organization', 'FinancialService'),
        'name' => 'FORZA CAPITAL PARTNERS LLC',
        'legalName' => 'FORZA CAPITAL PARTNERS LLC',
        'foundingDate' => '2026-01-10',
        'identifier' => '0451396744',
        'url' => home_url('/'),
        'description' => 'New Jersey business receivables purchase funding and separate AI Automation Audit consulting.',
        'areaServed' => array(
            '@type' => 'State',
            'name' => 'New Jersey',
        ),
        'knowsAbout' => array(
            'business receivables purchase',
            'revenue-based funding',
            'merchant cash advance education',
            'AI automation audits',
        ),
    );

    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
}
add_action('wp_head', 'forza_json_ld');

function forza_tracking_head(): void
{
    $pixel_id = trim((string) get_theme_mod('forza_meta_pixel_id', ''));
    if ($pixel_id === '' || !preg_match('/^[0-9]+$/', $pixel_id)) {
        return;
    }
    ?>
    <!-- Meta Pixel configured through Customize > FORZA Marketing. -->
    <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '<?php echo esc_js($pixel_id); ?>');
    fbq('track', 'PageView');
    </script>
    <?php
}
add_action('wp_head', 'forza_tracking_head', 20);

function forza_customize_register(WP_Customize_Manager $wp_customize): void
{
    $wp_customize->add_section('forza_marketing', array(
        'title' => __('FORZA Marketing', 'forza-capital-partners'),
        'priority' => 160,
    ));

    $wp_customize->add_setting('forza_meta_pixel_id', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('forza_meta_pixel_id', array(
        'label' => __('Meta Pixel ID', 'forza-capital-partners'),
        'section' => 'forza_marketing',
        'type' => 'text',
        'description' => __('Numeric Meta Pixel ID only. Leave blank until tracking is approved.', 'forza-capital-partners'),
    ));
}
add_action('customize_register', 'forza_customize_register');

function forza_add_menu_item_once(int $menu_id, int $page_id): void
{
    $existing_items = wp_get_nav_menu_items($menu_id);
    if (is_array($existing_items)) {
        foreach ($existing_items as $item) {
            if ((int) $item->object_id === $page_id && $item->object === 'page') {
                return;
            }
        }
    }

    wp_update_nav_menu_item($menu_id, 0, array(
        'menu-item-title' => get_the_title($page_id),
        'menu-item-object-id' => $page_id,
        'menu-item-object' => 'page',
        'menu-item-type' => 'post_type',
        'menu-item-status' => 'publish',
    ));
}

function forza_seed_site_content(): void
{
    $pages = array(
        'home' => array('title' => 'Home', 'template' => 'front-page.php'),
        'business-funding' => array('title' => 'Business Funding', 'template' => 'page-business-funding.php'),
        'eligibility' => array('title' => 'Eligibility', 'template' => 'page-eligibility.php'),
        'how-it-works' => array('title' => 'How It Works', 'template' => 'page-how-it-works.php'),
        'ai-automation-audit' => array('title' => 'AI Automation Audit', 'template' => 'page-ai-automation-audit.php'),
        'insights' => array('title' => 'Insights', 'template' => 'page-insights.php'),
        'about' => array('title' => 'About', 'template' => 'page-about.php'),
        'contact' => array('title' => 'Contact', 'template' => 'page-contact.php'),
        'privacy' => array('title' => 'Privacy Policy', 'template' => 'page-privacy.php'),
        'terms' => array('title' => 'Terms of Use', 'template' => 'page-terms.php'),
        'disclosures' => array('title' => 'Disclosures', 'template' => 'page-disclosures.php'),
        'thank-you' => array('title' => 'Thank You', 'template' => 'page.php'),
    );

    $page_ids = array();
    foreach ($pages as $slug => $page) {
        $existing = get_page_by_path($slug);
        if ($existing instanceof WP_Post) {
            $page_ids[$slug] = $existing->ID;
        } else {
            $page_ids[$slug] = wp_insert_post(array(
                'post_title' => $page['title'],
                'post_name' => $slug,
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_content' => '',
            ));
        }

        if (!empty($page['template']) && !is_wp_error($page_ids[$slug])) {
            update_post_meta((int) $page_ids[$slug], '_wp_page_template', $page['template']);
        }
    }

    if (!empty($page_ids['home']) && !is_wp_error($page_ids['home'])) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', (int) $page_ids['home']);
    }

    $primary_menu = wp_get_nav_menu_object('FORZA Primary');
    if (!$primary_menu) {
        $primary_menu_id = wp_create_nav_menu('FORZA Primary');
    } else {
        $primary_menu_id = (int) $primary_menu->term_id;
    }

    $footer_menu = wp_get_nav_menu_object('FORZA Footer');
    if (!$footer_menu) {
        $footer_menu_id = wp_create_nav_menu('FORZA Footer');
    } else {
        $footer_menu_id = (int) $footer_menu->term_id;
    }

    $primary_items = array('business-funding', 'eligibility', 'how-it-works', 'ai-automation-audit', 'insights', 'about');
    $footer_items = array('business-funding', 'eligibility', 'how-it-works', 'ai-automation-audit', 'insights', 'privacy', 'terms', 'disclosures');

    foreach ($primary_items as $slug) {
        if (empty($page_ids[$slug]) || is_wp_error($page_ids[$slug])) {
            continue;
        }
        forza_add_menu_item_once($primary_menu_id, (int) $page_ids[$slug]);
    }

    foreach ($footer_items as $slug) {
        if (empty($page_ids[$slug]) || is_wp_error($page_ids[$slug])) {
            continue;
        }
        forza_add_menu_item_once($footer_menu_id, (int) $page_ids[$slug]);
    }

    $locations = get_theme_mod('nav_menu_locations', array());
    $locations['primary'] = $primary_menu_id;
    $locations['footer'] = $footer_menu_id;
    set_theme_mod('nav_menu_locations', $locations);

    $posts = array(
        array(
            'post_title' => 'Revenue-Based Funding vs. Bank Loans: Key Differences for NJ Business Owners',
            'post_excerpt' => 'A plain-English guide to receivables purchases, factor rates, reconciliation, and when a loan may be a better fit.',
            'post_content' => '<p>Revenue-based funding is built around business receivables, while a bank loan is built around fixed debt repayment. The right choice depends on cash flow, time horizon, existing obligations, and whether the business can support variable remittance.</p><p>FORZA CAPITAL PARTNERS LLC reviews NJ businesses manually and does not treat eligibility as approval. This article is educational and not legal, tax, or financing advice.</p>',
        ),
        array(
            'post_title' => 'How Factor Rates Work in a Merchant Cash Advance',
            'post_excerpt' => 'Understand the total purchased amount, the difference from interest, and how prepayment discounts should be shown clearly.',
            'post_content' => '<p>A factor rate is multiplied by the funded amount to calculate the purchased receivables amount. For example, a $10,000 advance at a 1.50 factor rate means $15,000 in purchased receivables before any eligible discount or reconciliation terms.</p>',
        ),
        array(
            'post_title' => 'What Reconciliation Means in Revenue-Based Funding',
            'post_excerpt' => 'Why a revenue-purchase agreement needs a realistic process when sales slow down or speed up.',
            'post_content' => '<p>Reconciliation helps align remittance with actual business revenue. It should be clear, documented, and practical for both the business owner and the funder.</p>',
        ),
        array(
            'post_title' => 'When Not to Use a Merchant Cash Advance',
            'post_excerpt' => 'A candid checklist for NJ owners who may need a different option.',
            'post_content' => '<p>Revenue-based funding is not a fit for every business. It may be the wrong tool if revenue is unstable, margins are already too tight, or existing advances leave no room for healthy operations.</p>',
        ),
    );

    foreach ($posts as $post) {
        if (get_page_by_path(sanitize_title($post['post_title']), OBJECT, 'post')) {
            continue;
        }
        wp_insert_post(array_merge($post, array(
            'post_type' => 'post',
            'post_status' => 'publish',
        )));
    }
}
add_action('after_switch_theme', 'forza_seed_site_content');
