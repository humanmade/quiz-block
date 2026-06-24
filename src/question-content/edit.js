import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Edit component for the hmquiz/question-content block.
 *
 * @return {Element} Editor element.
 */
export default function Edit() {
	const blockProps = useBlockProps( { className: 'hmquiz-editor__question-content' } );

	return (
		<div { ...blockProps }>
			<div className="hmquiz-editor__feedback-label">
				<span className="hmquiz-editor__feedback-badge hmquiz-editor__feedback-badge--content">
					📎 Question Content
				</span>
				{ ' — shown between question and choices (add any block below)' }
			</div>
			<InnerBlocks renderAppender={ InnerBlocks.ButtonBlockAppender } />
		</div>
	);
}
