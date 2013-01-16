typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

/***
 * TODO: create error classes for:
 * InvalidConfigurationException
 * TypeException
 * SchemaException
 * PropertyException
 *
 */

suite( 'expurg8.type.Object', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : UNDEF };
		try {
			expect( expurg8.create( '{}', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Object: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Object' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( '{}' );
		expect( type.contingency ).to.equal( null );

		type = expurg8.create( '{}', { fallback : 'foo' } );
		expect( type.contingency ).to.equal( 'foo' );

		type = expurg8.create( '{}', { contingency : 'will not be set', fallback : 'bar' } );
		expect( type.contingency ).to.equal( 'bar' );

		type = expurg8.create( '{}', { fallback : function() { return [1,2,3]; } } );
		expect( type.contingency ).to.eql( [1,2,3] );
		expect( type.contingency ).to.eql( type.contingency );
		expect( type.contingency ).to.not.equal( type.contingency );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( '{}' ), val = [1,2,3];

		expect( type.coerce( val ) ).to.equal( val );
		expect( type.coerce( UNDEF ) ).to.equal( null );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( '{}' );

		expect( type.valid( null ) ).to.be.true;
		expect( type.valid( UNDEF ) ).to.be.false;
		expect( type.valid( {} ) ).to.be.true;

		done();
	} );
} );
