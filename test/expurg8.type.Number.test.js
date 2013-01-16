typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Number', function() {

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : 'abc' };
		try {
			expect( expurg8.create( 'number', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Number: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Number' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return 17; },
			max      : 13,
			min      : 7
		};
		try {
			expect( expurg8.create( 'number', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Number: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Number' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			max      : -13,
			min      : 7
		};
		try {
			expect( expurg8.create( 'number', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Number: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Number' );
			expect( e.configuration ).to.equal( config );
		}

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
