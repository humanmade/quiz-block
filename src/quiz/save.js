import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save() {
	const blockProps = useBlockProps.save( { className: 'hmquiz' } );

	return (
		<div { ...blockProps } data-hmquiz="">
			<InnerBlocks.Content />
		</div>
	);
}
