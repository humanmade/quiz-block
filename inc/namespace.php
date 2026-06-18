<?php
/**
 * Core plugin functions.
 */

declare( strict_types=1 );

namespace HM\QuizBlock;

/**
 * Register all plugin hooks.
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
	load_plugin_textdomain( 'hmquiz', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
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
 * Register scripts, styles, and block types.
 *
 * @return void
 */
function register_blocks(): void {
	$plugin_dir = plugin_dir_path( __DIR__ );
	$plugin_url = plugins_url( '', __DIR__ );

	// Editor script (registers all five block types).
	wp_register_script(
		'hmquiz-editor',
		$plugin_url . '/assets/js/editor.js',
		[ 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ],
		(string) ( filemtime( $plugin_dir . 'assets/js/editor.js' ) ?: time() ),
		false // Must load in <head> so blocks are registered before the editor initialises.
	);

	// Editor styles.
	wp_register_style(
		'hmquiz-editor-style',
		$plugin_url . '/assets/css/editor.css',
		[ 'wp-edit-blocks' ],
		(string) ( filemtime( $plugin_dir . 'assets/css/editor.css' ) ?: time() )
	);

	// Frontend styles (also loaded in the editor so previews look right).
	wp_register_style(
		'hmquiz-style',
		$plugin_url . '/assets/css/frontend.css',
		[],
		(string) ( filemtime( $plugin_dir . 'assets/css/frontend.css' ) ?: time() )
	);

	// Quiz container block.
	register_block_type( 'hmquiz/quiz', [
		'editor_script' => 'hmquiz-editor',
		'editor_style'  => 'hmquiz-editor-style',
		'style'         => 'hmquiz-style',
	] );

	// Question block.
	register_block_type( 'hmquiz/question', [
		'editor_script' => 'hmquiz-editor',
	] );

	// Feedback block.
	register_block_type( 'hmquiz/feedback', [
		'editor_script' => 'hmquiz-editor',
	] );

	// Question supplementary content block.
	register_block_type( 'hmquiz/question-content', [
		'editor_script' => 'hmquiz-editor',
	] );

	// Completion screen block.
	register_block_type( 'hmquiz/quiz-complete', [
		'editor_script' => 'hmquiz-editor',
	] );
}

/**
 * Enqueue the frontend interaction script on any page that contains the quiz block.
 *
 * Note: has_block() covers all template types — singular, archive, custom queries.
 *
 * @return void
 */
function enqueue_frontend(): void {
	if ( ! has_block( 'hmquiz/quiz' ) ) {
		return;
	}

	$plugin_dir = plugin_dir_path( __DIR__ );
	$plugin_url = plugins_url( '', __DIR__ );

	wp_enqueue_script(
		'hmquiz-frontend',
		$plugin_url . '/assets/js/frontend.js',
		[],
		(string) ( filemtime( $plugin_dir . 'assets/js/frontend.js' ) ?: time() ),
		true
	);
}
