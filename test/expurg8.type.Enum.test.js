typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Enum', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : UNDEF };
		try {
			expect( expurg8.create( 'enum', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Enum: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Enum' );
			expect( e.configuration ).to.equal( config );
		}

		var config = { fallback : 'foo' };
		try {
			expect( expurg8.create( 'enum', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Enum: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Enum' );
			expect( e.configuration ).to.equal( config );
		}

		var config = { fallback : 'foo', list : ['bar', 'baz'] };
		try {
			expect( expurg8.create( 'enum', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Enum: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Enum' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( 'enum', { list : ['foo', 'bar', 'baz'] } );
		expect( type.contingency ).to.equal( 'foo' );

		type = expurg8.create( 'enum', { fallback : 'bar', list : 'foo bar baz' } );
		expect( type.contingency ).to.equal( 'bar' );

		type = expurg8.create( 'enum', { fallback : 'zam', inverted : true, list : 'foo bar baz' } );
		expect( type.contingency ).to.equal( 'zam' );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'enum', { list : ['foo', 'bar', 'baz'] } );
		expect( type.coerce( 'zam' ) ).to.equal( 'foo' );

		type = expurg8.create( 'enum', { fallback : 'bar', list : 'foo bar baz' } );
		expect( type.coerce( 'zam' ) ).to.equal( 'bar' );

		type = expurg8.create( 'enum', { fallback : 'zam', inverted : true, list : 'foo bar baz' } );
		expect( type.coerce( 'bar' ) ).to.equal( 'zam' );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'enum', { list : ['foo', 'bar', 'baz'] } );
		expect( type.valid( 'zam' ) ).to.be.false;
		expect( type.valid( 'foo' ) ).to.be.true;

		type = expurg8.create( 'enum', { fallback : 'bar', list : 'foo bar baz' } );
		expect( type.valid( 'zam' ) ).to.be.false;
		expect( type.valid( 'baz' ) ).to.be.true;

		type = expurg8.create( 'enum', { fallback : 'zam', inverted : true, list : 'foo bar baz' } );
		expect( type.valid( 'zoom' ) ).to.be.true;
		expect( type.valid( 'bar' ) ).to.be.false;

		done();
	} );
} );
