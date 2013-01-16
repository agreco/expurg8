typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Integer', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : 'abc' };
		try {
			expect( expurg8.create( 'int', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Integer: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Integer' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return 17; },
			max      : 13,
			min      : 7
		};
		try {
			expect( expurg8.create( 'int', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Integer: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Integer' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			max      : 13,
			min      : 7
		};
		try {
			expect( expurg8.create( 'int', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Integer: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Integer' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			max      : 1.13,
			min      : -.7
		};
		try {
			expect( expurg8.create( 'int', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Integer: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Integer' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( 'int' );
		expect( type.contingency ).to.be.a( 'number' );
		expect( type.contingency ).to.equal( 0 );

		type = expurg8.create( 'int', { fallback : 17 } );
		expect( type.contingency ).to.equal( 17 );

		type = expurg8.create( 'int', {
			contingency : 'will not be set',
			fallback    : '123456789',
			precision   : 7
		} );
		expect( type.contingency ).to.equal( 123456789 );
		expect( type.precision ).to.equal( 0 );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'int', {
			fallback  : 50,
			max       : 100,
			min       : -100
		} );

		expect( type.coerce(  101 ) ).to.equal( 100 );
		expect( type.coerce(  100.0001 ) ).to.equal( 100 );
		expect( type.coerce(  100.000000000000000000001 ) ).to.equal( 100 );
		expect( type.coerce(  100.0000000000000001 ) ).to.equal( 100 );
		expect( type.coerce( -101 ) ).to.equal( -100 );
		expect( type.coerce( -100.0001 ) ).to.equal( -100 );
		expect( type.coerce(  47 ) ).to.equal( 47 );
		expect( type.coerce( -47 ) ).to.equal( -47 );

		expect( type.coerce(  '101' ) ).to.equal( 100 );
		expect( type.coerce(  '100.0001' ) ).to.equal( 100 );
		expect( type.coerce(  '100.000000000000000000001' ) ).to.equal( 100 );
		expect( type.coerce(  '100.0000000000000001' ) ).to.equal( 100 );
		expect( type.coerce( '-101' ) ).to.equal( -100 );
		expect( type.coerce( '-100.0001' ) ).to.equal( -100 );
		expect( type.coerce(  '47' ) ).to.equal( 47 );
		expect( type.coerce( '-47' ) ).to.equal( -47 );

		expect( type.coerce( Math.PI ) ).to.equal( 3 );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'int', {
			fallback  : 50,
			max       : 100,
			min       : -100
		} );

		expect( type.valid(  101 ) ).to.be.false;
		expect( type.valid(  100.0001 ) ).to.be.false;
// what do we do about this, since:
// 100.000000000000000000001 * 1e20 === 100 * 1e20
//		expect( type.valid(  100.000000000000000000001 ) ).to.be.false;
		expect( type.valid(  100.00000000000001 ) ).to.be.false;
		expect( type.valid( -101 ) ).to.be.false;
		expect( type.valid( -100.0001 ) ).to.be.false;
		expect( type.valid(  47 ) ).to.be.true;
		expect( type.valid( -47 ) ).to.be.true;
		expect( type.valid(  100 ) ).to.be.true;
		expect( type.valid( -100 ) ).to.be.true;
		expect( type.valid(  0 ) ).to.be.true;
		expect( type.valid( -0 ) ).to.be.true;

		expect( type.valid(  '101' ) ).to.be.false;
		expect( type.valid(  '100.0001' ) ).to.be.false;
		expect( type.valid(  '100.000000000000000000001' ) ).to.be.false;
		expect( type.valid(  '100.0000000000000001' ) ).to.be.false;
		expect( type.valid( '-101' ) ).to.be.false;
		expect( type.valid( '-100.0001' ) ).to.be.false;
		expect( type.valid(  '47' ) ).to.be.false;
		expect( type.valid( '-47' ) ).to.be.false;

		expect( type.valid( Math.PI ) ).to.be.false;

		done();
	} );
} );
