import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * Save component for the hmquiz/question block.
 *
 * @param {Object} props
 * @param {Object} props.attributes
 * @return {Element} Saved HTML element.
 */
export default function Save( { attributes } ) {
	const { question, alternatives, correctAnswer } = attributes;
	const blockProps = useBlockProps.save( { className: 'hmquiz__question' } );

	return (
		<div { ...blockProps } data-question="" data-correct={ correctAnswer }>
			<RichText.Content
				tagName="p"
				className="hmquiz__question-text"
				value={ question }
			/>
			<InnerBlocks.Content />
			<div className="hmquiz__alternatives">
				{ alternatives.map( ( alt ) => (
					<button
						key={ alt.id }
						className="hmquiz__alternative"
						data-id={ alt.id }
					>
						{ alt.text }
					</button>
				) ) }
			</div>
		</div>
	);
}
