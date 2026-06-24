import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { nextAltId } from '../utils/nextAltId';

/**
 * Edit component for the hmquiz/question block.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {string}   props.clientId
 * @return {Element} Editor element.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const { question, alternatives, correctAnswer } = attributes;
	const blockProps = useBlockProps({ className: 'hmquiz-editor__question' });

	/**
	 * Append a new blank alternative to the list.
	 */
	function addAlternative() {
		const id = nextAltId(alternatives);
		setAttributes({
			alternatives: alternatives.concat([{ id, text: '' }]),
		});
	}

	/**
	 * Update the text of a single alternative.
	 *
	 * @param {string} id   Alternative ID.
	 * @param {string} text New text value.
	 */
	function updateText(id, text) {
		setAttributes({
			alternatives: alternatives.map((a) =>
				a.id === id ? { id: a.id, text } : a
			),
		});
	}

	/**
	 * Remove an alternative by ID. Minimum of 2 alternatives enforced.
	 *
	 * @param {string} id Alternative ID to remove.
	 */
	function removeAlternative(id) {
		if (alternatives.length <= 2) {
			return;
		}
		const next = alternatives.filter((a) => a.id !== id);
		setAttributes({
			alternatives: next,
			correctAnswer: correctAnswer === id ? next[0].id : correctAnswer,
		});
	}

	/**
	 * Move an alternative up one position in the list.
	 *
	 * @param {string} id Alternative ID to move up.
	 */
	function moveUp(id) {
		const idx = alternatives.findIndex((a) => a.id === id);
		if (idx <= 0) {
			return;
		}
		const next = alternatives.slice();
		const tmp = next[idx - 1];
		next[idx - 1] = next[idx];
		next[idx] = tmp;
		setAttributes({ alternatives: next });
	}

	/**
	 * Move an alternative down one position in the list.
	 *
	 * @param {string} id Alternative ID to move down.
	 */
	function moveDown(id) {
		const idx = alternatives.findIndex((a) => a.id === id);
		if (idx === -1 || idx >= alternatives.length - 1) {
			return;
		}
		const next = alternatives.slice();
		const tmp = next[idx + 1];
		next[idx + 1] = next[idx];
		next[idx] = tmp;
		setAttributes({ alternatives: next });
	}

	return (
		<div {...blockProps}>
			{/* ── 1. Question text ───────────────────────────────── */}
			<div className="hmquiz-editor__section-label">❓ Question</div>
			<RichText
				tagName="p"
				className="hmquiz-editor__question-text"
				placeholder={__('Enter your question here…', 'hmquiz')}
				value={question}
				onChange={(v) => setAttributes({ question: v })}
				allowedFormats={['core/bold', 'core/italic', 'core/code']}
			/>

			{/* ── 2. InnerBlocks ─────────────────────────────────
			 *    Template: question-content first, then feedback panels.
			 */}
			<div className="hmquiz-editor__inner-section">
				<div className="hmquiz-editor__section-label">
					🖼 Question Content & Answer Feedback
				</div>
				<p className="hmquiz-editor__inner-hint">
					{'Use the "📎 Question Content" section to add images, videos, or any content that accompanies the question. ' +
						'It will appear between the question and the answer choices on the published page.'}
				</p>
				<InnerBlocks
					template={[
						['hmquiz/question-content', {}],
						['hmquiz/feedback', { type: 'correct' }],
						['hmquiz/feedback', { type: 'incorrect' }],
					]}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>

			{/* ── 3. Alternatives ────────────────────────────────── */}
			<div className="hmquiz-editor__section-label hmquiz-editor__section-label--alts">
				✅ Alternatives — select the radio to mark the correct answer
			</div>
			<div className="hmquiz-editor__alternatives">
				{alternatives.map((alt, altIndex) => {
					const isCorrect = correctAnswer === alt.id;
					return (
						<div
							key={alt.id}
							className={
								'hmquiz-editor__alt-row' +
								(isCorrect
									? ' hmquiz-editor__alt-row--correct'
									: '')
							}
						>
							<input
								type="radio"
								title="Mark as correct answer"
								name={'hmquiz-correct-' + clientId}
								checked={isCorrect}
								onChange={() =>
									setAttributes({ correctAnswer: alt.id })
								}
							/>
							<input
								type="text"
								className="hmquiz-editor__alt-input"
								value={alt.text}
								placeholder={__('Alternative text…', 'hmquiz')}
								onChange={(e) =>
									updateText(alt.id, e.target.value)
								}
							/>
							{isCorrect && (
								<span className="hmquiz-editor__alt-correct-badge">
									✓ Correct
								</span>
							)}
							<Button
								icon="arrow-up-alt2"
								isSmall={true}
								disabled={altIndex === 0}
								label="Move up"
								onClick={() => moveUp(alt.id)}
							/>
							<Button
								icon="arrow-down-alt2"
								isSmall={true}
								disabled={altIndex === alternatives.length - 1}
								label="Move down"
								onClick={() => moveDown(alt.id)}
							/>
							<Button
								className="hmquiz-editor__alt-remove"
								icon="trash"
								isDestructive={true}
								isSmall={true}
								disabled={alternatives.length <= 2}
								label="Remove alternative"
								onClick={() => removeAlternative(alt.id)}
							/>
						</div>
					);
				})}
				<Button
					className="hmquiz-editor__add-alt"
					variant="secondary"
					isSmall={true}
					icon="plus"
					onClick={addAlternative}
				>
					Add Alternative
				</Button>
			</div>
		</div>
	);
}
