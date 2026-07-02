import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * Deprecated v1: InnerBlocks.Content appeared AFTER .hmquiz__alternatives in the DOM.
 * CSS flexbox ordering wasn't applied yet.
 */
const v1 = {
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
				{ id: 'a', text: '' },
				{ id: 'b', text: '' },
			],
		},
		correctAnswer: {
			type: 'string',
			default: 'a',
		},
	},

	/**
	 * Serialise the block to static HTML.
	 *
	 * @param {Object} props Block properties and attributes.
	 * @return {Element} Saved HTML element.
	 */
	save( props ) {
		const { question, alternatives, correctAnswer } = props.attributes;
		const blockProps = useBlockProps.save( {
			className: 'hmquiz__question',
		} );

		return (
			<div
				{ ...blockProps }
				data-question=""
				data-correct={ correctAnswer }
			>
				<RichText.Content
					tagName="p"
					className="hmquiz__question-text"
					value={ question }
				/>
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
				<InnerBlocks.Content />
			</div>
		);
	},
};

export default [ v1 ];
