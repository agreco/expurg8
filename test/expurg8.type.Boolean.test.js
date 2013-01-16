typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Boolean', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : UNDEF };
		try {
			expect( expurg8.create( 'bool', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Boolean: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Boolean' );
			expect( e.configuration ).to.equal( config );
		}

		config = { fallback : 'true' };
		try {
			expect( expurg8.create( 'bool', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Boolean: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Boolean' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( 'bool' );
		expect( type.contingency ).to.equal( false );

		type = expurg8.create( 'bool', { fallback : true } );
		expect( type.contingency ).to.equal( true );

		type = expurg8.create( 'bool', { contingency : 'will not be set', fallback : true } );
		expect( type.contingency ).to.equal( true );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'boolean', { fallback : true } );
		expect( type.coerce( 'false' ) ).to.be.false;
		expect( type.coerce( 0 ) ).to.be.false;

		type = expurg8.create( 'boolean' );
		expect( type.coerce( 'null' ) ).to.be.false;
		expect( type.coerce( null ) ).to.be.false;
		expect( type.coerce( !0 ) ).to.be.true;

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'boolean' );
		expect( type.valid( 0 ) ).to.be.false;
		expect( type.valid( 'true' ) ).to.be.false;
		expect( type.valid( false ) ).to.be.true;
		expect( type.valid( true ) ).to.be.true;

		done();
	} );
} );
