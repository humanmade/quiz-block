import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl, ColorPalette } from '@wordpress/components';

/**
 * Edit component for the hmquiz/quiz-complete block.
 *
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @return {Element} Editor element.
 */
export default function Edit({ attributes, setAttributes }) {
	const { enabled, backgroundColor } = attributes;
	const editorStyle = backgroundColor ? { backgroundColor } : {};
	const blockProps = useBlockProps({
		className: `hmquiz-editor__complete${enabled ? '' : ' hmquiz-editor__complete--disabled'}`,
		style: editorStyle,
	});

	return (
		<div {...blockProps}>
			{/* ── Sidebar settings panel ── */}
			<InspectorControls>
				<PanelBody
					title={__('Completion Screen', 'hmquiz')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Show completion screen', 'hmquiz')}
						help={
							enabled
								? __(
										'Visitors will see this screen after the last question.',
										'hmquiz'
									)
								: __(
										'The completion screen is hidden — the quiz ends silently after the last question.',
										'hmquiz'
									)
						}
						checked={enabled}
						onChange={(val) => setAttributes({ enabled: val })}
					/>
				</PanelBody>
				<PanelBody
					title={__('Background Color', 'hmquiz')}
					initialOpen={true}
				>
					<ColorPalette
						value={backgroundColor}
						onChange={(val) =>
							setAttributes({ backgroundColor: val || '' })
						}
					/>
				</PanelBody>
			</InspectorControls>

			{/* ── Block body ── */}
			<div className="hmquiz-editor__complete-label">
				<span className="hmquiz-editor__complete-badge">
					🎉 Completion Screen
				</span>
				{enabled
					? ' — shown after all questions are answered'
					: ' — disabled (toggle ON in the ⚙ Settings panel on the right)'}
			</div>

			<div
				className={`hmquiz-editor__complete-inner${enabled ? '' : ' hmquiz-editor__complete-inner--disabled'}`}
			>
				<InnerBlocks
					template={[
						[
							'core/heading',
							{ level: 2, content: '🎉 Quiz Complete!' },
						],
						[
							'core/paragraph',
							{ content: 'You answered all the questions.' },
						],
					]}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>
		</div>
	);
}
