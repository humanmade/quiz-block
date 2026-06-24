<?php
/**
 * Plugin Name:       Quiz Block
 * Plugin URI:        https://humanmade.com
 * Description:       Multi-step quiz using Gutenberg blocks. Add the Quiz block to any post or page, build questions with multiple-choice alternatives, mark the correct answer, and add rich feedback content for correct and incorrect responses.
 * Version:           1.0.0
 * Requires at least: 5.9
 * Requires PHP:      7.4
 * Author:            Human Made
 * License:           GPL-2.0-or-later
 * Text Domain:       hmquiz
 *
 * @package           hmquiz
 */

namespace HM\QuizBlock;

const PLUGIN_FILE = __FILE__;
const ROOT_DIR    = __DIR__;

require_once __DIR__ . '/inc/namespace.php';

bootstrap();
