typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Array', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : UNDEF };
		try {
			expect( expurg8.create( '[]', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Array: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Array' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return .17; },
			max      : .13,
			min      : .7
		};

		try {
			expect( expurg8.create( '[]', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Array: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Array' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return []; },
			max      : 4,
			min      : 5
		};
		try {
			expect( expurg8.create( '[]', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Array: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Array' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return [1,2]; },
			max      : 4,
			min      : 3
		};
		try {
			expect( expurg8.create( '[]', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Array: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Array' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( '[]' );
		expect( type.contingency ).to.be.a( 'array' );
		expect( type.contingency ).to.eql( [] );

		type = expurg8.create( '[]', { fallback : function() { return [1,2,3]; } } );
		expect( type.contingency ).to.eql( [1,2,3] );
		expect( type.contingency ).to.not.equal( type.contingency );

		type = expurg8.create( '[]', {
			contingency : 'will not be set',
			fallback    : function() { return [1,2,3]; },
			max         : 3
		} );
		expect( type.contingency ).to.eql( [1,2,3] );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( '[]' );
		;!function() {
			var args = type.coerce( arguments );
			expect( args ).to.be.a( 'array' );
			expect( args ).to.eql( [1,2,3] );
		}( 1, 2, 3 );

		type = expurg8.create( '[]', {
			fallback : function() { return [1,2,3]; },
			max      : 4,
			min      : 3
		} );
		expect( type.coerce( [1,2,3,4,5,6,7,8] ) ).to.eql( [1,2,3,4] );
		expect( type.coerce( [7,8] ) ).to.eql( [7,8,1] );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( '[]' );
		;!function() {
			expect( type.valid( arguments ) ).to.be.false;
		}( 1, 2, 3 );

		type = expurg8.create( '[]', {
			fallback : function() { return [1,2,3]; },
			max      : 4,
			min      : 3
		} );
		expect( type.valid( [1,2,3,4,5,6,7,8] ) ).to.be.false;
		expect( type.valid( [7,8] ) ).to.be.false;
		expect( type.valid( [6,7,8] ) ).to.be.true;
		expect( type.valid( 'a b c'.split( ' ' ) ) ).to.be.true;

		done();
	} );
} );
