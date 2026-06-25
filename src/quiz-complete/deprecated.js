import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Deprecated v1: no backgroundColor attribute, no data-bg in saved HTML.
 */
const v1 = {
	attributes: {
		enabled: {
			type: 'boolean',
			default: true,
		},
	},

	/**
	 * Serialise the block to static HTML.
	 *
	 * @param {Object} props Block properties and attributes.
	 * @return {Element} Saved HTML element.
	 */
	save( props ) {
		const { enabled } = props.attributes;
		const blockProps = useBlockProps.save( {
			className: 'hmquiz__complete',
		} );

		return (
			<div
				{ ...blockProps }
				data-quiz-complete=""
				data-enabled={ enabled ? 'true' : 'false' }
				style={ { display: 'none' } }
			>
				<InnerBlocks.Content />
			</div>
		);
	},
};

export default [ v1 ];
