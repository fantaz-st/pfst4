<?php
/**
 * Plugin Name: PFST4 Revalidation
 * Description: Notifies the Next.js frontend to revalidate its cache when a page or post is published, updated, or deleted.
 *
 * Requires two constants defined in wp-config.php (not the options table,
 * so the secret never ends up in a DB export):
 *
 *   define( 'PFST_NEXT_SITE_URL', 'https://pfst.unist.hr' );
 *   define( 'PFST_REVALIDATE_SECRET', '...' ); // must match WP_REVALIDATE_SECRET in Next.js
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PFST_REVALIDATE_POST_TYPES = array( 'page', 'post' );

function pfst_trigger_revalidate( $uri = null ) {
	if ( ! defined( 'PFST_NEXT_SITE_URL' ) || ! defined( 'PFST_REVALIDATE_SECRET' ) ) {
		return;
	}

	wp_remote_post(
		rtrim( PFST_NEXT_SITE_URL, '/' ) . '/api/revalidate',
		array(
			'timeout'  => 5,
			'blocking' => false,
			'headers'  => array( 'Content-Type' => 'application/json' ),
			'body'     => wp_json_encode(
				array_filter(
					array(
						'secret' => PFST_REVALIDATE_SECRET,
						'uri'    => $uri,
					)
				)
			),
		)
	);
}

function pfst_revalidate_on_save( $post_id, $post ) {
	if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
		return;
	}

	if ( ! in_array( $post->post_type, PFST_REVALIDATE_POST_TYPES, true ) ) {
		return;
	}

	if ( 'publish' !== $post->post_status ) {
		return;
	}

	$uri = wp_make_link_relative( get_permalink( $post_id ) );
	pfst_trigger_revalidate( $uri ?: null );
}
add_action( 'save_post', 'pfst_revalidate_on_save', 10, 2 );

function pfst_revalidate_on_delete( $post_id, $post ) {
	if ( ! $post instanceof WP_Post || ! in_array( $post->post_type, PFST_REVALIDATE_POST_TYPES, true ) ) {
		pfst_trigger_revalidate();
		return;
	}

	// The row is already gone, but $post still carries its slug/parent, so
	// get_permalink() can rebuild the uri from the object alone.
	$uri = wp_make_link_relative( get_permalink( $post ) );
	pfst_trigger_revalidate( $uri ?: null );
}
add_action( 'deleted_post', 'pfst_revalidate_on_delete', 10, 2 );
