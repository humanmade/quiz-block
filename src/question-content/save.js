import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the hmquiz/question-content block.
 *
 * @return {Element} Saved HTML element.
 */
export default function Save() {
	const blockProps = useBlockProps.save( {
		className: 'hmquiz__question-content',
	} );

	return (
		<div { ...blockProps } data-question-content="">
			<InnerBlocks.Content />
		</div>
	);
}
