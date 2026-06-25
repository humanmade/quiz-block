import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the hmquiz/quiz-complete block.
 *
 * @param {Object} props
 * @param {Object} props.attributes
 * @return {Element} Saved HTML element.
 */
export default function Save( { attributes } ) {
	const { enabled, backgroundColor } = attributes;
	const blockProps = useBlockProps.save( { className: 'hmquiz__complete' } );

	return (
		<div
			{ ...blockProps }
			data-quiz-complete=""
			data-enabled={ enabled ? 'true' : 'false' }
			data-bg={ backgroundColor || '' }
			style={ { display: 'none' } }
		>
			<InnerBlocks.Content />
		</div>
	);
}
