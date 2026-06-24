import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the hmquiz/feedback block.
 *
 * @param {Object} props
 * @param {Object} props.attributes
 * @return {Element} Saved HTML element.
 */
export default function Save({ attributes }) {
	const { type } = attributes;
	const blockProps = useBlockProps.save({
		className: `hmquiz__feedback hmquiz__feedback--${type}`,
	});

	return (
		<div {...blockProps} data-feedback={type} style={{ display: 'none' }}>
			<InnerBlocks.Content />
		</div>
	);
}
