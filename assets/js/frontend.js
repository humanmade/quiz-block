/**
 * Quiz Block Plugin — Frontend Script
 *
 * - Shows one question at a time with a progress bar.
 * - On answer: marks correct/incorrect, reveals feedback, shows Next button.
 * - After the last question: shows the [data-quiz-complete] block if present
 *   and enabled; otherwise shows nothing (quiz ends silently).
 *
 * NOTE: Questions are hidden/shown via element.style.display (not the `hidden`
 * attribute) because display:flex on .hmquiz__question overrides the UA rule
 * [hidden]{display:none}.
 */
( function () {
	'use strict';

	/**
	 * Find all quiz containers on the page and initialise each one.
	 */
	function init() {
		document.querySelectorAll( '[data-hmquiz]' ).forEach( initQuiz );
	}

	/**
	 * Set up a single quiz: progress bar, per-question handlers, completion logic.
	 *
	 * @param {HTMLElement} quizEl The quiz container element.
	 */
	function initQuiz( quizEl ) {
		const questions = Array.prototype.slice.call(
			quizEl.querySelectorAll( '[data-question]' )
		);
		if ( ! questions.length ) {
			return;
		}

		const total = questions.length;
		let current = 0;

		// ── Completion block ─────────────────────────────────────────────────
		// Hide it at startup; showCompletion() will reveal it when appropriate.
		const customComplete = quizEl.querySelector( '[data-quiz-complete]' );
		if ( customComplete ) {
			customComplete.style.display = 'none';
		}

		// ── Progress bar ─────────────────────────────────────────────────────
		const progressEl = makeEl(
			'div',
			{ className: 'hmquiz__progress' },
			'<div class="hmquiz__progress-bar" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="' +
				total +
				'">' +
				'<div class="hmquiz__progress-fill" style="width:0%"></div>' +
				'</div>' +
				'<p class="hmquiz__progress-text">Question <strong class="hmquiz__current-num">1</strong> of <strong>' +
				total +
				'</strong></p>'
		);
		quizEl.insertBefore( progressEl, quizEl.firstChild );

		const progressFill = progressEl.querySelector(
			'.hmquiz__progress-fill'
		);
		const progressBar = progressEl.querySelector( '.hmquiz__progress-bar' );
		const currentNumEl = progressEl.querySelector( '.hmquiz__current-num' );

		// ── Live region for screen reader announcements ───────────────────────
		const liveEl = makeEl( 'div', {
			'aria-live': 'polite',
			'aria-atomic': 'true',
			style: 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap',
		} );
		quizEl.appendChild( liveEl );

		// ── Per-question setup ───────────────────────────────────────────────
		questions.forEach( function ( questionEl, index ) {
			// Hide all questions except the first via style.display (not hidden attr).
			if ( index > 0 ) {
				questionEl.style.display = 'none';
			}

			// Hide all feedback panels (save function already outputs style="display:none";
			// this is a safety net).
			Array.prototype.slice
				.call( questionEl.querySelectorAll( '[data-feedback]' ) )
				.forEach( function ( fb ) {
					fb.style.display = 'none';
				} );

			// Next / Finish button (hidden until the user answers).
			const isLast = index === total - 1;
			const nextBtn = makeEl(
				'button',
				{
					className: 'hmquiz__next-btn',
					style: 'display:none',
				},
				isLast ? 'Finish Quiz' : 'Next Question →'
			);
			questionEl.appendChild( nextBtn );

			// Alternative click.
			Array.prototype.slice
				.call( questionEl.querySelectorAll( '.hmquiz__alternative' ) )
				.forEach( function ( altBtn ) {
					altBtn.addEventListener( 'click', function () {
						if ( questionEl.getAttribute( 'data-answered' ) ) {
							return;
						}
						questionEl.setAttribute( 'data-answered', '1' );

						const correctId =
							questionEl.getAttribute( 'data-correct' );
						const selectedId = altBtn.getAttribute( 'data-id' );
						const isCorrect = selectedId === correctId;

						// Mark alternatives.
						Array.prototype.slice
							.call(
								questionEl.querySelectorAll(
									'.hmquiz__alternative'
								)
							)
							.forEach( function ( btn ) {
								btn.disabled = true;
								if (
									btn.getAttribute( 'data-id' ) === correctId
								) {
									btn.classList.add(
										'hmquiz__alternative--correct'
									);
								} else if (
									btn.getAttribute( 'data-id' ) === selectedId
								) {
									btn.classList.add(
										'hmquiz__alternative--incorrect'
									);
								}
							} );

						// Reveal feedback.
						const feedbackType = isCorrect
							? 'correct'
							: 'incorrect';
						const feedbackEl = questionEl.querySelector(
							'[data-feedback="' + feedbackType + '"]'
						);
						if ( feedbackEl ) {
							feedbackEl.style.display = '';
							feedbackEl.classList.add(
								'hmquiz__feedback--visible'
							);
						}

						// Announce result to screen readers.
						liveEl.textContent = isCorrect
							? 'Correct!'
							: 'Incorrect.';

						// Show next/finish button.
						nextBtn.style.display = '';
						nextBtn.classList.add( 'hmquiz__next-btn--visible' );
					} );
				} );

			// Next button click.
			nextBtn.addEventListener( 'click', function () {
				if ( ! isLast ) {
					questionEl.style.display = 'none';
					current++;
					const nextQ = questions[ current ];
					nextQ.style.display = '';
					nextQ.classList.add( 'hmquiz__question--enter' );
					updateProgress(
						progressFill,
						progressBar,
						currentNumEl,
						current,
						total
					);
					liveEl.textContent =
						'Question ' + ( current + 1 ) + ' of ' + total + '.';
					quizEl.scrollIntoView( {
						behavior: 'smooth',
						block: 'start',
					} );
				} else {
					showCompletion(
						quizEl,
						questions,
						progressFill,
						progressBar,
						customComplete,
						liveEl
					);
				}
			} );
		} );

		updateProgress( progressFill, progressBar, currentNumEl, 0, total );
	}

	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Update the progress bar fill width and ARIA/text labels.
	 *
	 * @param {HTMLElement|null} fill    Progress fill element.
	 * @param {HTMLElement|null} bar     Progress bar element (for aria-valuenow).
	 * @param {HTMLElement|null} numEl   Current question number text node.
	 * @param {number}           current Zero-based index of the active question.
	 * @param {number}           total   Total number of questions.
	 */
	function updateProgress( fill, bar, numEl, current, total ) {
		const pct = Math.round( ( current / total ) * 100 );
		if ( fill ) {
			fill.style.width = pct + '%';
		}
		if ( bar ) {
			bar.setAttribute( 'aria-valuenow', current + 1 );
		}
		if ( numEl ) {
			numEl.textContent = current + 1;
		}
	}

	/**
	 * Hide all questions and display the completion UI.
	 * Uses the [data-quiz-complete] block if present and enabled; falls back to
	 * a hardcoded completion card otherwise.
	 *
	 * @param {HTMLElement}      quizEl         Quiz container element.
	 * @param {HTMLElement[]}    questions      All question elements.
	 * @param {HTMLElement|null} fill           Progress fill element.
	 * @param {HTMLElement|null} bar            Progress bar element.
	 * @param {HTMLElement|null} customComplete The [data-quiz-complete] block, or null.
	 * @param {HTMLElement|null} liveEl         aria-live region for announcements.
	 */
	function showCompletion(
		quizEl,
		questions,
		fill,
		bar,
		customComplete,
		liveEl
	) {
		// Hide all questions.
		questions.forEach( function ( q ) {
			q.style.display = 'none';
		} );

		// Fill progress to 100 %.
		if ( fill ) {
			fill.style.width = '100%';
		}
		if ( bar ) {
			bar.setAttribute( 'aria-valuenow', questions.length );
		}
		if ( liveEl ) {
			liveEl.textContent = 'Quiz complete!';
		}

		if ( customComplete ) {
			// Use the editor-defined completion screen if it's enabled.
			if ( customComplete.getAttribute( 'data-enabled' ) !== 'false' ) {
				const bg = customComplete.getAttribute( 'data-bg' );
				if ( bg ) {
					customComplete.style.backgroundColor = bg;
				}
				customComplete.style.display = '';
				customComplete.classList.add( 'hmquiz__complete--visible' );
				quizEl.scrollIntoView( {
					behavior: 'smooth',
					block: 'start',
				} );
			}
			// If disabled: quiz ends silently (no completion UI).
		} else {
			// Fallback when no hmquiz/quiz-complete block is present.
			const fallback = makeEl(
				'div',
				{ className: 'hmquiz__completion' },
				'<div class="hmquiz__completion-icon" aria-hidden="true">🎉</div>' +
					'<h2 class="hmquiz__completion-title">Quiz Complete!</h2>' +
					'<p class="hmquiz__completion-message">You answered all ' +
					questions.length +
					' question' +
					( questions.length !== 1 ? 's' : '' ) +
					'.</p>'
			);
			quizEl.appendChild( fallback );
			quizEl.scrollIntoView( {
				behavior: 'smooth',
				block: 'start',
			} );
		}
	}

	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Create a DOM element with props and optional inner HTML.
	 *
	 * SECURITY NOTE: The `html` parameter is set via innerHTML. Only pass
	 * hardcoded literal strings here — never user-supplied or server data.
	 * All current call sites use string literals, so this is safe.
	 * @param {string}           tag
	 * @param {Object}           props
	 * @param {string|undefined} html
	 */
	function makeEl( tag, props, html ) {
		const el = document.createElement( tag );
		Object.keys( props || {} ).forEach( function ( k ) {
			if ( k === 'className' ) {
				el.className = props[ k ];
			} else if ( k === 'style' ) {
				el.style.cssText = props[ k ];
			} else {
				el.setAttribute( k, props[ k ] );
			}
		} );
		if ( html !== undefined ) {
			el.innerHTML = html;
		}
		return el;
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
