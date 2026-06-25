import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps( { className: 'hmquiz-editor__quiz' } );

	return (
		<div { ...blockProps }>
			<div className="hmquiz-editor__quiz-label">🎯 Quiz</div>
			<InnerBlocks
				allowedBlocks={ [ 'hmquiz/question', 'hmquiz/quiz-complete' ] }
				template={ [
					[ 'hmquiz/question', {} ],
					[ 'hmquiz/quiz-complete', {} ],
				] }
				renderAppender={ InnerBlocks.ButtonBlockAppender }
			/>
		</div>
	);
}
