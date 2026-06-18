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



https://github.com/user-attachments/assets/1146033f-d0f2-4f80-9517-635314ab15be



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

## How It Works

The plugin adds five custom Gutenberg blocks. When a visitor opens a page containing a quiz, JavaScript takes over: it shows one question at a time, updates a progress bar, reveals feedback after each answer, and shows a completion screen at the end — all without any page reload.

## Creating a Quiz

### 1. Add the Quiz block

In the block inserter, search for **Quiz** (under the _Quiz_ category) and add it to your post or page. This is the outer container — all other quiz blocks live inside it.

### 2. Add questions

<img width="848" height="697" alt="question" src="https://github.com/user-attachments/assets/b75e22c1-7778-42fd-95a5-3faaf326daed" />


Inside the Quiz block, add one or more **Quiz Question** blocks. Each question has:

- **Question text** — a rich-text field at the top of the block.
- **Alternatives** — multiple-choice options listed below the question text. Click **Add Alternative** to add more. Use the ↑ / ↓ arrows to reorder them. Select the radio button next to an option to mark it as the correct answer.
<img width="1248" height="519" alt="iScreen Shoter - Google Chrome - 260618111606" src="https://github.com/user-attachments/assets/e038d981-5753-4441-9422-0153e3f8cf0c" />

- **Question Content** _(optional)_ — an inner section where you can add any WordPress block (image, video, paragraph, etc.) to accompany the question. It appears between the question text and the answer choices on the frontend.
<img width="848" height="697" alt="content" src="https://github.com/user-attachments/assets/1b0dfd79-35d7-4007-a41d-c26e6b714bf2" />


- **Correct / Incorrect Feedback** — two inner panels where you can add any blocks. The matching panel is shown to the visitor after they answer.
<img width="1248" height="519" alt="iScreen Shoter - Google Chrome - 260618111606" src="https://github.com/user-attachments/assets/3d3e3276-cc2a-4da6-af58-de68711e4f8f" />

### 3. Add a completion screen _(optional)_
<img width="1605" height="907" alt="iScreen Shoter - Google Chrome - 260618112141" src="https://github.com/user-attachments/assets/df9de279-17a0-422c-b577-b246ab419222" />


After your last Question block, add the **Quiz Completion Screen** block. You can:

- Write any content inside it (heading, paragraph, image, etc.).
- Toggle it on or off in the block settings sidebar.
- Pick a background colour in the sidebar.

If you don't add this block (or toggle it off), the quiz simply ends silently after the last question.
<img width="562" height="906" alt="iScreen Shoter - Google Chrome - 260618112150" src="https://github.com/user-attachments/assets/58527051-2a0c-46e9-8edc-95cf0e026cf9" />


### 4. Publish

Save or publish the post. The quiz is fully interactive on the frontend — no shortcodes, no page builders, no configuration needed.

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
