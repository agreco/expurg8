typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.String', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		expect( true ).to.be.true;
		done();
	} );

	test( 'contingency/fallback', function( done ) {
		expect( true ).to.be.true;
		done();
	} );

	test( 'coerce', function( done ) {
		expect( true ).to.be.true;
		done();
	} );

	test( 'valid', function( done ) {
		expect( true ).to.be.true;
		done();
	} );
} );
