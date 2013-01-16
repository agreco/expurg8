typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );

//	moment = require( 'moment' );
//	require( 'moment/lang/en-gb' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.api', function() {
	suite( 'date', function() {
		test( 'default: d8.js', function( done ) {
			expect( 'default_format' in expurg8.api.date ).to.be.true;
			expect( expurg8.api.date.between( new Date( 2012, 0, 2 ), new Date( 2012, 0, 1 ), new Date( 2012, 0, 3 ) ) ).to.be.true;
			expect( +( expurg8.api.date.coerce( '2012-01-01', Date.formats.ISO_8601_SHORT ) ) ).to.equal( +( new Date( 2012, 0, 1 ) ) );
			expect( expurg8.api.date.format( new Date( 2012, 0, 1 ), Date.formats.ISO_8601_SHORT ) ).to.equal( '2012-01-01' );

			done();
		} );

	/*	suite( 'using: moment.js', function() {
			expurg8.api.date = {
				default_format : 'c',
				between        : function( date, gt, lt ) { return ; },
				coerce         : function( date, format ) { return ; },
				format         : function( date, format ) { return ; }
			};
			test( 'set api', function( done ) {
				expect( true ).to.be.true;
				done();
			} );
		} );*/
	} );
} );
