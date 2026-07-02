# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-06-12

### Added

- Multi-step quiz block (`hmquiz/quiz`) with one question at a time and progress bar
- Question block (`hmquiz/question`) with multiple-choice alternatives and correct answer selection
- Correct/incorrect feedback blocks (`hmquiz/feedback`) supporting any core WordPress blocks
- Question content block (`hmquiz/question-content`) for supplementary media between question and choices
- Quiz completion screen block (`hmquiz/quiz-complete`) with show/hide toggle and background color picker
- CSS flexbox ordering to display question content, alternatives, and feedback in the correct visual sequence regardless of DOM order
- `deprecated` migration for blocks across save function changes
- i18n groundwork: `load_plugin_textdomain` (PHP) and `wp.i18n` for editor block strings; several frontend strings remain hard-coded
- Accessibility: `:focus-visible` styles, ARIA attributes on progress bar, `prefers-reduced-motion` support

[Unreleased]: https://github.com/humanmade/quiz-block/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/humanmade/quiz-block/releases/tag/v1.0.0
