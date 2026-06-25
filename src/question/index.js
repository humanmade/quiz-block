import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';

registerBlockType( metadata, { edit: Edit, save: Save, deprecated } );
