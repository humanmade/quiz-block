<?php
/**
 * Quiz Block core functions.
 *
 * @package hmquiz
 */

declare( strict_types=1 );

namespace HM\QuizBlock;

/**
 * Connect namespace functions to WordPress hooks.
 *
 * @return void
 */
function bootstrap(): void {
	add_action( 'init', __NAMESPACE__ . '\\load_textdomain' );
	add_filter( 'block_categories_all', __NAMESPACE__ . '\\block_categories' );
	add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_frontend' );
}

/**
 * Load plugin translations.
 *
 * @return void
 */
function load_textdomain(): void {
	load_plugin_textdomain( 'hmquiz', false, dirname( plugin_basename( HMQUIZ_FILE ) ) . '/languages' );
}

/**
 * Prepend the Quiz category to the block inserter category list.
 *
 * @param array<int, array<string, string>> $categories Existing block categories.
 * @return array<int, array<string, string>> Modified block categories.
 */
function block_categories( array $categories ): array {
	return array_merge(
		[
			[
				'slug'  => 'hmquiz',
				'title' => __( 'Quiz', 'hmquiz' ),
				'icon'  => 'list-view',
			],
		],
		$categories
	);
}

/**
 * Register shared styles and all block types from their block.json metadata.
 *
 * @return void
 */
function register_blocks(): void {
	wp_register_style(
		'hmquiz-editor-style',
		plugins_url( 'assets/css/editor.css', HMQUIZ_FILE ),
		[ 'wp-edit-blocks' ],
		(string) ( filemtime( HMQUIZ_DIR . '/assets/css/editor.css' ) ?: time() )
	);

	// Register each block from its compiled block.json in build/.
	$blocks = [
		'quiz',
		'question',
		'question-content',
		'feedback',
		'quiz-complete',
	];

	foreach ( $blocks as $block ) {
		register_block_type_from_metadata( HMQUIZ_DIR . '/build/' . $block );
	}

	// Load JS translations for blocks that use wp.i18n (__).
	$translated_blocks = [ 'question', 'quiz-complete' ];
	foreach ( $translated_blocks as $block ) {
		wp_set_script_translations(
			'hmquiz-' . $block . '-editor-script',
			'hmquiz',
			HMQUIZ_DIR . '/languages'
		);
	}
}

/**
 * Enqueue the frontend interaction script on any page containing the quiz block.
 *
 * @return void
 */
function enqueue_frontend(): void {
	if ( ! has_block( 'hmquiz/quiz' ) ) {
		return;
	}

	wp_enqueue_script(
		'hmquiz-frontend',
		plugins_url( 'assets/js/frontend.js', HMQUIZ_FILE ),
		[],
		(string) ( filemtime( HMQUIZ_DIR . '/assets/js/frontend.js' ) ?: time() ),
		true
	);
}
