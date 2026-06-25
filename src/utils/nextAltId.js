/**
 * Return the next unused single-letter ID for an alternative.
 *
 * @param {Array} alts Current alternatives array.
 * @return {string} Next available letter, or a timestamp fallback.
 */
export function nextAltId( alts ) {
	const used = {};
	alts.forEach( ( a ) => {
		used[ a.id ] = true;
	} );
	const letters = 'abcdefghijklmnopqrstuvwxyz';
	for ( let i = 0; i < letters.length; i++ ) {
		if ( ! used[ letters[ i ] ] ) {
			return letters[ i ];
		}
	}
	return String( Date.now() );
}
