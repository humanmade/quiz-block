<?php
/**
 * Plugin Name:       Quiz Block
 * Plugin URI:        https://humanmade.com
 * Description:       Multi-step quiz using Gutenberg blocks. Add the Quiz block to any post or page, build questions with multiple-choice alternatives, mark the correct answer, and add rich feedback content for correct and incorrect responses.
 * Version:           1.0.0
 * Requires at least: 5.9
 * Requires PHP:      7.4
 * Author:            Human Made
 * License:           GPL-2.0+
 * Text Domain:       hmquiz
 */

declare( strict_types=1 );

defined( 'ABSPATH' ) || exit;

/**
 * Load plugin translations.
 *
 * @return void
 */
function hmquiz_load_textdomain(): void {
	load_plugin_textdomain( 'hmquiz', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'hmquiz_load_textdomain' );

/**
 * Prepend the Quiz category to the block inserter category list.
 *
 * @param array $categories Existing block categories.
 * @return array Modified block categories.
 */
function hmquiz_block_categories( array $categories ): array {
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
add_filter( 'block_categories_all', 'hmquiz_block_categories' );

/**
 * Register scripts, styles, and block types.
 *
 * @return void
 */
function hmquiz_register_blocks(): void {
	$plugin_dir = plugin_dir_path( __FILE__ );

	// Editor script (registers all five block types).
	wp_register_script(
		'hmquiz-editor',
		plugins_url( 'assets/js/editor.js', __FILE__ ),
		[ 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ],
		(string) ( filemtime( $plugin_dir . 'assets/js/editor.js' ) ?: time() ),
		false // Must load in <head> so blocks are registered before the editor initialises.
	);

	// Editor styles.
	wp_register_style(
		'hmquiz-editor-style',
		plugins_url( 'assets/css/editor.css', __FILE__ ),
		[ 'wp-edit-blocks' ],
		(string) ( filemtime( $plugin_dir . 'assets/css/editor.css' ) ?: time() )
	);

	// Frontend styles (also loaded in the editor so previews look right).
	wp_register_style(
		'hmquiz-style',
		plugins_url( 'assets/css/frontend.css', __FILE__ ),
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
add_action( 'init', 'hmquiz_register_blocks' );

/**
 * Enqueue the frontend interaction script on any page that contains the quiz block.
 *
 * Note: has_block() covers all template types — singular, archive, custom queries.
 *
 * @return void
 */
function hmquiz_enqueue_frontend(): void {
	if ( ! has_block( 'hmquiz/quiz' ) ) {
		return;
	}

	$plugin_dir = plugin_dir_path( __FILE__ );

	wp_enqueue_script(
		'hmquiz-frontend',
		plugins_url( 'assets/js/frontend.js', __FILE__ ),
		[],
		(string) ( filemtime( $plugin_dir . 'assets/js/frontend.js' ) ?: time() ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'hmquiz_enqueue_frontend' );
