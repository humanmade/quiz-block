# Quiz Block
<table width="100%">
	<tr>
		<td align="left" width="70%">
			<strong>Quiz Block</strong><br />
			Multi-step quiz plugin using Gutenberg blocks. No build step required.
		</td>
		<td align="center" width="30%">
			<a href="https://github.com/humanmade/quiz-block/actions/workflows/lint.yml">
				<img src="https://github.com/humanmade/quiz-block/actions/workflows/lint.yml/badge.svg" alt="Lint" />
			</a>
		</td>
	</tr>
	<tr>
		<td>
			A <strong><a href="https://hmn.md/">Human Made</a></strong> project.
		</td>
		<td align="center" width="30%">
			<img src="https://hmn.md/content/themes/hmnmd/assets/images/hm-logo.svg" width="100" />
		</td>
	</tr>
</table>

## Features

- One question at a time with animated progress bar
- Multiple-choice alternatives with radio selection for correct answer in the editor
- Correct/incorrect feedback panels — supports any core WordPress block (paragraphs, images, videos, etc.)
- Optional supplementary content block between question and choices
- Customisable completion screen with show/hide toggle and background colour picker
- No build step — plain JavaScript using `window.wp` globals
- Full i18n support
- Accessible: `:focus-visible`, ARIA attributes, `prefers-reduced-motion`

## Block Structure

```
[hmquiz/quiz]
  ├── [hmquiz/question]  (repeatable)
  │     ├── [hmquiz/question-content]         ← optional images, videos, text
  │     ├── [hmquiz/feedback type="correct"]  ← any blocks, shown on correct answer
  │     └── [hmquiz/feedback type="incorrect"]
  └── [hmquiz/quiz-complete]                  ← optional completion screen
```

## Requirements

- WordPress 5.9+
- PHP 7.4+

## Installation

Download the latest release ZIP from the [Releases](../../releases) page, then in WordPress admin go to **Plugins → Add New → Upload Plugin**.

## Development

### Setup

```bash
composer install
npm install
```

### Linting

```bash
# PHP (PHPCS)
composer lint

# PHP (PHPStan level 8)
composer phpstan

# JavaScript (ESLint with @humanmade/eslint-config)
npm run lint:js

# CSS (Stylelint with @humanmade/stylelint-config)
npm run lint:css

# All at once
npm run lint
```

### Releasing

Push a tag in the format `vX.Y.Z` to trigger the release workflow. GitHub Actions will build a clean ZIP (excluding dev files) and create a GitHub Release automatically.

```bash
git tag v1.1.0
git push origin v1.1.0
```

## License

[GPL-2.0+](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
