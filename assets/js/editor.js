/**
 * Quiz Block Plugin — Editor Script
 *
 * Block types:
 *   hmquiz/quiz              — outer container
 *   hmquiz/question          — question + alternatives (attrs) + InnerBlocks
 *   hmquiz/question-content  — supplementary content between question and choices
 *   hmquiz/feedback          — answer feedback panel (correct | incorrect)
 *   hmquiz/quiz-complete     — optional customisable completion screen
 *
 * NOTE: No block uses `allowedBlocks` on its InnerBlocks. This is intentional —
 * restricting allowed blocks at one level was causing the block inserter to show
 * an empty list inside nested InnerBlocks (e.g. inside Feedback). The `parent`
 * attribute on each block still controls where it can be *inserted*.
 */
( function ( blocks, element, blockEditor, components, i18n ) {
	'use strict';

	let registerBlockType = blocks.registerBlockType;
	let el                = element.createElement;
	let InnerBlocks       = blockEditor.InnerBlocks;
	let useBlockProps     = blockEditor.useBlockProps;
	let RichText          = blockEditor.RichText;
	let InspectorControls = blockEditor.InspectorControls;
	let Button            = components.Button;
	let PanelBody         = components.PanelBody;
	let ToggleControl     = components.ToggleControl;
	let ColorPalette      = components.ColorPalette;
	let __                = i18n.__;  // Translation helper — wrap all user-visible strings.

	// ─────────────────────────────────────────────────────────────────────────
	// Helpers
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Return the next unused single-letter ID for an alternative.
	 *
	 * @param {Array}  alts Current alternatives array.
	 * @return {string} Next available letter, or a timestamp fallback.
	 */
	function nextAltId( alts ) {
		let used = {};
		alts.forEach( function ( a ) {
			used[ a.id ] = true;
		} );
		let letters = 'abcdefghijklmnopqrstuvwxyz';
		for ( let i = 0; i < letters.length; i++ ) {
			if ( ! used[ letters[ i ] ] ) return letters[ i ];
		}
		return String( Date.now() );
	}

	// ─────────────────────────────────────────────────────────────────────────
	// hmquiz/quiz
	// ─────────────────────────────────────────────────────────────────────────

	registerBlockType( 'hmquiz/quiz', {
		apiVersion: 2,
		title: 'Quiz',
		icon: 'list-view',
		category: 'hmquiz',
		supports: { html: false },

		example: {
			innerBlocks: [
				{
					name: 'hmquiz/question',
					attributes: {
						question: 'What is the capital of France?',
						alternatives: [
							{
								id: 'a',
								text: 'London',
							},
							{
								id: 'b',
								text: 'Paris',
							},
							{
								id: 'c',
								text: 'Berlin',
							},
						],
						correctAnswer: 'b',
					},
				},
			],
		},

		/**
		 * Render the question block to editor UI.
		 *
		 * @return {Element} Editor element.
		 */
		edit: function () {
			let blockProps = useBlockProps( { className: 'hmquiz-editor__quiz' } );
			return el( 'div', blockProps,
				el( 'div', { className: 'hmquiz-editor__quiz-label' }, '🎯 Quiz' ),
				el( InnerBlocks, {
					allowedBlocks: [ 'hmquiz/question', 'hmquiz/quiz-complete' ],
					template: [
						[ 'hmquiz/question', {} ],
						[ 'hmquiz/quiz-complete', {} ],
					],
					renderAppender: InnerBlocks.ButtonBlockAppender,
				} )
			);
		},

		/**
		 * Serialise the question block to static HTML.
		 *
		 * @return {Element} Saved HTML element.
		 */
		save: function () {
			let blockProps = useBlockProps.save( { className: 'hmquiz' } );
			return el( 'div', Object.assign( {}, blockProps, { 'data-hmquiz': '' } ),
				el( InnerBlocks.Content )
			);
		},
	} );

	// ─────────────────────────────────────────────────────────────────────────
	// hmquiz/question
	// ─────────────────────────────────────────────────────────────────────────

	registerBlockType( 'hmquiz/question', {
		apiVersion: 2,
		title: 'Quiz Question',
		icon: 'editor-help',
		category: 'hmquiz',
		parent: [ 'hmquiz/quiz' ],
		supports: {
			html: false,
			reusable: false,
		},

		attributes: {
			question: {
				type: 'string',
				source: 'html',
				selector: '.hmquiz__question-text',
				default: '',
			},
			alternatives: {
				type: 'array',
				default: [
					{
						id: 'a',
						text: '',
					},
					{
						id: 'b',
						text: '',
					},
				],
			},
			correctAnswer: {
				type: 'string',
				default: 'a',
			},
		},

		// ── Deprecated save versions ─────────────────────────────────────────
		// v1: InnerBlocks.Content appeared AFTER .hmquiz__alternatives in the DOM.
		//     CSS flexbox ordering wasn't applied yet.
		deprecated: [
			{
				attributes: {
					question: {
						type: 'string',
						source: 'html',
						selector: '.hmquiz__question-text',
						default: '',
					},
					alternatives: {
						type: 'array',
						default: [
							{
								id: 'a',
								text: '',
							},
							{
								id: 'b',
								text: '',
							},
						],
					},
					correctAnswer: {
						type: 'string',
						default: 'a',
					},
				},
				/**
				 * Serialise the block block to static HTML.
				 *
				 * @param {Object} props Block properties and attributes.
				 * @return {Element} Saved HTML element.
				 */
				save: function ( props ) {
					let question      = props.attributes.question;
					let alternatives  = props.attributes.alternatives;
					let correctAnswer = props.attributes.correctAnswer;
					let blockProps    = useBlockProps.save( { className: 'hmquiz__question' } );

					return el( 'div',
						Object.assign( {}, blockProps, {
							'data-question': '',
							'data-correct': correctAnswer,
						} ),
						el( RichText.Content, {
							tagName: 'p',
							className: 'hmquiz__question-text',
							value: question,
						} ),
						el( 'div', { className: 'hmquiz__alternatives' },
							alternatives.map( function ( alt ) {
								return el( 'button', {
									key: alt.id,
									className: 'hmquiz__alternative',
									'data-id': alt.id,
								}, alt.text );
							} )
						),
						el( InnerBlocks.Content )
					);
				},
			},
		],

		/**
		 * Render the block block to editor UI.
		 *
		 * @param {Object} props Block properties and attributes.
		 * @return {Element} Editor element.
		 */
		edit: function ( props ) {
			let attributes    = props.attributes;
			let setAttributes = props.setAttributes;
			let clientId      = props.clientId;
			let question      = attributes.question;
			let alternatives  = attributes.alternatives;
			let correctAnswer = attributes.correctAnswer;

			let blockProps = useBlockProps( { className: 'hmquiz-editor__question' } );

			/**
			 * Append a new blank alternative to the list.
			 */
			function addAlternative() {
				let id = nextAltId( alternatives );
				setAttributes( {
					alternatives: alternatives.concat( [ {
						id: id,
						text: '',
					} ] ),
				} );
			}
			/**
			 * Update the text of a single alternative.
			 *
			 * @param {string} id   Alternative ID.
			 * @param {string} text New text value.
			 */
			function updateText( id, text ) {
				setAttributes( {
					alternatives: alternatives.map( function ( a ) {
						return a.id === id ? {
							id: a.id,
							text: text,
						} : a;
					} ),
				} );
			}
			/**
			 * Remove an alternative by ID. Minimum of 2 alternatives enforced.
			 *
			 * @param {string} id Alternative ID to remove.
			 */
			function removeAlternative( id ) {
				if ( alternatives.length <= 2 ) return;
				let next = alternatives.filter( function ( a ) {
					return a.id !== id;
				} );
				setAttributes( {
					alternatives: next,
					correctAnswer: correctAnswer === id ? next[ 0 ].id : correctAnswer,
				} );
			}

			/**
			 * Move an alternative up one position in the list.
			 *
			 * @param {string} id Alternative ID to move up.
			 */
			function moveUp( id ) {
				let idx = alternatives.findIndex( function ( a ) {
					return a.id === id;
				} );
				if ( idx <= 0 ) return;
				let next = alternatives.slice();
				let tmp = next[ idx - 1 ];
				next[ idx - 1 ] = next[ idx ];
				next[ idx ] = tmp;
				setAttributes( { alternatives: next } );
			}

			/**
			 * Move an alternative down one position in the list.
			 *
			 * @param {string} id Alternative ID to move down.
			 */
			function moveDown( id ) {
				let idx = alternatives.findIndex( function ( a ) {
					return a.id === id;
				} );
				if ( idx === -1 || idx >= alternatives.length - 1 ) return;
				let next = alternatives.slice();
				let tmp = next[ idx + 1 ];
				next[ idx + 1 ] = next[ idx ];
				next[ idx ] = tmp;
				setAttributes( { alternatives: next } );
			}

			return el( 'div', blockProps,

				/* ── 1. Question text ───────────────────────────────── */
				el( 'div', { className: 'hmquiz-editor__section-label' }, '❓ Question' ),
				el( RichText, {
					tagName: 'p',
					className: 'hmquiz-editor__question-text',
					placeholder: __( 'Enter your question here…', 'hmquiz' ),
					value: question,
					/**
					 *
					 */
					onChange: function ( v ) {
						setAttributes( { question: v } );
					},
					allowedFormats: [ 'core/bold', 'core/italic', 'core/code' ],
				} ),

				/* ── 2. InnerBlocks ─────────────────────────────────
				 *    Template: question-content first, then feedback panels.
				 *    No allowedBlocks restriction — all blocks are available
				 *    inside question-content and inside each feedback panel.
				 */
				el( 'div', { className: 'hmquiz-editor__inner-section' },
					el( 'div', { className: 'hmquiz-editor__section-label' }, '🖼 Question Content & Answer Feedback' ),
					el( 'p', { className: 'hmquiz-editor__inner-hint' },
						'Use the "📎 Question Content" section to add images, videos, or any content that accompanies the question. ' +
						'It will appear between the question and the answer choices on the published page.'
					),
					el( InnerBlocks, {
						// No allowedBlocks — any block can be added.
						// The parent attribute on hmquiz/question-content and hmquiz/feedback
						// ensures they still appear first in the inserter when inside this block.
						template: [
							[ 'hmquiz/question-content', {} ],
							[ 'hmquiz/feedback', { type: 'correct' } ],
							[ 'hmquiz/feedback', { type: 'incorrect' } ],
						],
						renderAppender: InnerBlocks.ButtonBlockAppender,
					} )
				),

				/* ── 3. Alternatives ────────────────────────────────── */
				el( 'div', { className: 'hmquiz-editor__section-label hmquiz-editor__section-label--alts' },
					'✅ Alternatives — select the radio to mark the correct answer'
				),
				el( 'div', { className: 'hmquiz-editor__alternatives' },
					alternatives.map( function ( alt, altIndex ) {
						let isCorrect = correctAnswer === alt.id;
						return el( 'div', {
							key: alt.id,
							className: 'hmquiz-editor__alt-row' + ( isCorrect ? ' hmquiz-editor__alt-row--correct' : '' ),
						},
						el( 'input', {
							type: 'radio',
							title: 'Mark as correct answer',
							name: 'hmquiz-correct-' + clientId,
							checked: isCorrect,
							/**
							 *
							 */
							onChange: function () {
								setAttributes( { correctAnswer: alt.id } );
							},
						} ),
						el( 'input', {
							type: 'text',
							className: 'hmquiz-editor__alt-input',
							value: alt.text,
							placeholder: __( 'Alternative text…', 'hmquiz' ),
							/**
							 *
							 */
							onChange: function ( e ) {
								updateText( alt.id, e.target.value );
							},
						} ),
						isCorrect && el( 'span', { className: 'hmquiz-editor__alt-correct-badge' }, '✓ Correct' ),
						el( Button, {
							icon: 'arrow-up-alt2',
							isSmall: true,
							disabled: altIndex === 0,
							label: 'Move up',
							/**
							 *
							 */
							onClick: function () {
								moveUp( alt.id );
							},
						} ),
						el( Button, {
							icon: 'arrow-down-alt2',
							isSmall: true,
							disabled: altIndex === alternatives.length - 1,
							label: 'Move down',
							/**
							 *
							 */
							onClick: function () {
								moveDown( alt.id );
							},
						} ),
						el( Button, {
							className: 'hmquiz-editor__alt-remove',
							icon: 'trash',
							isDestructive: true,
							isSmall: true,
							disabled: alternatives.length <= 2,
							label: 'Remove alternative',
							/**
							 *
							 */
							onClick: function () {
								removeAlternative( alt.id );
							},
						} )
						);
					} ),
					el( Button, {
						className: 'hmquiz-editor__add-alt',
						variant: 'secondary',
						isSmall: true,
						icon: 'plus',
						onClick: addAlternative,
					}, 'Add Alternative' )
				)
			);
		},

		/**
		 * Serialise the block block to static HTML.
		 *
		 * @param {Object} props Block properties and attributes.
		 * @return {Element} Saved HTML element.
		 */
		save: function ( props ) {
			let question      = props.attributes.question;
			let alternatives  = props.attributes.alternatives;
			let correctAnswer = props.attributes.correctAnswer;
			let blockProps    = useBlockProps.save( { className: 'hmquiz__question' } );

			return el( 'div',
				Object.assign( {}, blockProps, {
					'data-question': '',
					'data-correct': correctAnswer,
				} ),
				// order:1 — question text
				el( RichText.Content, {
					tagName: 'p',
					className: 'hmquiz__question-text',
					value: question,
				} ),
				// InnerBlocks: question-content (order:2) + feedback panels (order:4)
				// The alternatives div (order:3) sits in between via CSS flexbox.
				el( InnerBlocks.Content ),
				// order:3 — alternatives
				el( 'div', { className: 'hmquiz__alternatives' },
					alternatives.map( function ( alt ) {
						return el( 'button', {
							key: alt.id,
							className: 'hmquiz__alternative',
							'data-id': alt.id,
						}, alt.text );
					} )
				)
			);
		},
	} );

	// ─────────────────────────────────────────────────────────────────────────
	// hmquiz/question-content — supplementary content block
	// Appears between question text and alternatives in the frontend (CSS order:2).
	// ─────────────────────────────────────────────────────────────────────────

	registerBlockType( 'hmquiz/question-content', {
		apiVersion: 2,
		title: 'Question Content',
		description: 'Optional content (image, video, text…) shown between the question and the answer choices.',
		icon: 'format-image',
		category: 'hmquiz',
		parent: [ 'hmquiz/question' ],
		supports: {
			html: false,
			reusable: false,
		},

		/**
		 * Render the question-content block to editor UI.
		 *
		 * @return {Element} Editor element.
		 */
		edit: function () {
			let blockProps = useBlockProps( { className: 'hmquiz-editor__question-content' } );
			return el( 'div', blockProps,
				el( 'div', { className: 'hmquiz-editor__feedback-label' },
					el( 'span', { className: 'hmquiz-editor__feedback-badge hmquiz-editor__feedback-badge--content' },
						'📎 Question Content'
					),
					' — shown between question and choices (add any block below)'
				),
				// No allowedBlocks, no parent restriction on inner blocks.
				// The user can add any block here: images, videos, paragraphs, etc.
				el( InnerBlocks, {
					renderAppender: InnerBlocks.ButtonBlockAppender,
				} )
			);
		},

		/**
		 * Serialise the question block to static HTML.
		 *
		 * @return {Element} Saved HTML element.
		 */
		save: function () {
			let blockProps = useBlockProps.save( { className: 'hmquiz__question-content' } );
			return el( 'div', Object.assign( {}, blockProps, { 'data-question-content': '' } ),
				el( InnerBlocks.Content )
			);
		},
	} );

	// ─────────────────────────────────────────────────────────────────────────
	// hmquiz/feedback
	// ─────────────────────────────────────────────────────────────────────────

	registerBlockType( 'hmquiz/feedback', {
		apiVersion: 2,
		title: 'Quiz Feedback',
		icon: 'format-chat',
		category: 'hmquiz',
		parent: [ 'hmquiz/question' ],
		supports: {
			html: false,
			reusable: false,
		},

		attributes: {
			type: {
				type: 'string',
				default: 'correct',
			},
		},

		/**
		 * Render the question block to editor UI.
		 *
		 * @param {Object} props Block properties and attributes.
		 * @return {Element} Editor element.
		 */
		edit: function ( props ) {
			let type       = props.attributes.type;
			let isCorrect  = type === 'correct';
			let blockProps = useBlockProps( {
				className: 'hmquiz-editor__feedback hmquiz-editor__feedback--' + type,
			} );
			return el( 'div', blockProps,
				el( 'div', { className: 'hmquiz-editor__feedback-label' },
					el( 'span', {
						className: 'hmquiz-editor__feedback-badge hmquiz-editor__feedback-badge--' + type,
					}, isCorrect ? '✓ Correct Answer' : '✗ Wrong Answer' ),
					' — add any block here'
				),
				el( InnerBlocks, { renderAppender: InnerBlocks.ButtonBlockAppender } )
			);
		},

		/**
		 * Serialise the block block to static HTML.
		 *
		 * @param {Object} props Block properties and attributes.
		 * @return {Element} Saved HTML element.
		 */
		save: function ( props ) {
			let type       = props.attributes.type;
			let blockProps = useBlockProps.save( { className: 'hmquiz__feedback hmquiz__feedback--' + type } );
			return el( 'div',
				Object.assign( {}, blockProps, {
					'data-feedback': type,
					style: 'display:none',
				} ),
				el( InnerBlocks.Content )
			);
		},
	} );

	// ─────────────────────────────────────────────────────────────────────────
	// hmquiz/quiz-complete — customisable completion screen
	// ─────────────────────────────────────────────────────────────────────────

	registerBlockType( 'hmquiz/quiz-complete', {
		apiVersion: 2,
		title: 'Quiz Completion Screen',
		description: 'Content shown after the visitor answers all questions. Toggle visibility in the settings panel.',
		icon: 'awards',
		category: 'hmquiz',
		parent: [ 'hmquiz/quiz' ],
		supports: {
			html: false,
			reusable: false,
		},

		attributes: {
			// When false the completion screen is skipped on the frontend.
			enabled: {
				type: 'boolean',
				default: true,
			},
			// Background color (any CSS color string, e.g. "#f0faf2" or "rgba(…)").
			backgroundColor: {
				type: 'string',
				default: '',
			},
		},

		// ── Deprecated save versions ─────────────────────────────────────────
		// v1: no backgroundColor attribute, no data-bg in saved HTML.
		deprecated: [
			{
				attributes: {
					enabled: {
						type: 'boolean',
						default: true,
					},
				},
				/**
				 * Serialise the quiz block to static HTML.
				 *
				 * @param {Object} props Block properties and attributes.
				 * @return {Element} Saved HTML element.
				 */
				save: function ( props ) {
					let enabled    = props.attributes.enabled;
					let blockProps = useBlockProps.save( { className: 'hmquiz__complete' } );
					return el( 'div',
						Object.assign( {}, blockProps, {
							'data-quiz-complete': '',
							'data-enabled': enabled ? 'true' : 'false',
							style: 'display:none',
						} ),
						el( InnerBlocks.Content )
					);
				},
			},
		],

		/**
		 * Render the block block to editor UI.
		 *
		 * @param {Object} props Block properties and attributes.
		 * @return {Element} Editor element.
		 */
		edit: function ( props ) {
			let enabled         = props.attributes.enabled;
			let backgroundColor = props.attributes.backgroundColor;
			let setAttributes   = props.setAttributes;

			let editorStyle = {};
			if ( backgroundColor ) editorStyle.backgroundColor = backgroundColor;

			let blockProps = useBlockProps( {
				className: 'hmquiz-editor__complete' + ( enabled ? '' : ' hmquiz-editor__complete--disabled' ),
				style: editorStyle,
			} );

			return el( 'div', blockProps,

				/* ── Sidebar settings panel ── */
				el( InspectorControls, null,
					el( PanelBody, {
						title: __( 'Completion Screen', 'hmquiz' ),
						initialOpen: true,
					},
					el( ToggleControl, {
						label: __( 'Show completion screen', 'hmquiz' ),
						help: enabled
							? __( 'Visitors will see this screen after the last question.', 'hmquiz' )
							: __( 'The completion screen is hidden — the quiz ends silently after the last question.', 'hmquiz' ),
						checked: enabled,
						/**
							 *
							 */
						onChange: function ( val ) {
							setAttributes( { enabled: val } );
						},
					} )
					),
					el( PanelBody, {
						title: __( 'Background Color', 'hmquiz' ),
						initialOpen: true,
					},
					el( ColorPalette, {
						value: backgroundColor,
						/**
							 *
							 */
						onChange: function ( val ) {
							setAttributes( { backgroundColor: val || '' } );
						},
					} )
					)
				),

				/* ── Block body ── */
				el( 'div', { className: 'hmquiz-editor__complete-label' },
					el( 'span', { className: 'hmquiz-editor__complete-badge' }, '🎉 Completion Screen' ),
					enabled
						? ' — shown after all questions are answered'
						: ' — disabled (toggle ON in the ⚙ Settings panel on the right)'
				),

				el( 'div', {
					className: 'hmquiz-editor__complete-inner' + ( enabled ? '' : ' hmquiz-editor__complete-inner--disabled' ),
				},
				el( InnerBlocks, {
					template: [
						[ 'core/heading',   {
							level: 2,
							content: '🎉 Quiz Complete!',
						} ],
						[ 'core/paragraph', { content: 'You answered all the questions.' } ],
					],
					renderAppender: InnerBlocks.ButtonBlockAppender,
				} )
				)
			);
		},

		/**
		 * Serialise the block block to static HTML.
		 *
		 * @param {Object} props Block properties and attributes.
		 * @return {Element} Saved HTML element.
		 */
		save: function ( props ) {
			let enabled         = props.attributes.enabled;
			let backgroundColor = props.attributes.backgroundColor;
			let blockProps      = useBlockProps.save( { className: 'hmquiz__complete' } );
			return el( 'div',
				Object.assign( {}, blockProps, {
					'data-quiz-complete': '',
					'data-enabled': enabled ? 'true' : 'false',
					'data-bg': backgroundColor || '',
					style: 'display:none',
				} ),
				el( InnerBlocks.Content )
			);
		},
	} );

} )(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.i18n
);
