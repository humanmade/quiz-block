import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Edit component for the hmquiz/feedback block.
 *
 * @param {Object} props
 * @param {Object} props.attributes
 * @return {Element} Editor element.
 */
export default function Edit( { attributes } ) {
	const { type } = attributes;
	const isCorrect = type === 'correct';
	const blockProps = useBlockProps( {
		className: `hmquiz-editor__feedback hmquiz-editor__feedback--${ type }`,
	} );

	return (
		<div { ...blockProps }>
			<div className="hmquiz-editor__feedback-label">
				<span className={ `hmquiz-editor__feedback-badge hmquiz-editor__feedback-badge--${ type }` }>
					{ isCorrect ? '✓ Correct Answer' : '✗ Wrong Answer' }
				</span>
				{ ' — add any block here' }
			</div>
			<InnerBlocks renderAppender={ InnerBlocks.ButtonBlockAppender } />
		</div>
	);
}
