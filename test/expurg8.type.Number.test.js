typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Number', function() {
	var UNDEF;

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
			fallback : function() { return .17; },
			max      : .13,
			min      : .7
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
			max      : -.13,
			min      : .7
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
		var type = expurg8.create( 'number' );
		expect( type.contingency ).to.be.a( 'number' );
		expect( type.contingency ).to.equal( 0 );

		type = expurg8.create( 'number', { fallback : .17 } );
		expect( type.contingency ).to.equal( .17 );

		type = expurg8.create( 'number', {
			contingency : 'will not be set',
			fallback    : '0.123456789',
			precision   : 7
		} );
		expect( type.contingency ).to.equal( .1234568 );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'number', {
			fallback  : Math.PI,
			max       : 4,
			min       : 3,
			precision : 4
		} );

		expect( type.coerce( 5 ) ).to.equal( 4 );
		expect( type.coerce( 4.0001 ) ).to.equal( 4 );
		expect( type.coerce( 2 ) ).to.equal( 3 );
		expect( type.coerce( 3.0001 ) ).to.equal( 3 );
		expect( type.coerce( 3.0009 ) ).to.equal( 3.001 );

		expect( type.coerce( '5' ) ).to.equal( 4 );
		expect( type.coerce( '4.0001' ) ).to.equal( 4 );
		expect( type.coerce( '2' ) ).to.equal( 3 );
		expect( type.coerce( '3.0001' ) ).to.equal( 3 );
		expect( type.coerce( '3.0009' ) ).to.equal( 3.001 );

		expect( type.coerce( Math.PI ) ).to.equal( 3.142 );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'number', {
			fallback  : Math.PI,
			max       : 4,
			min       : 3,
			precision : 4
		} );

		expect( type.valid( 5 ) ).to.be.false;
		expect( type.valid( 4.0001 ) ).to.be.false;
		expect( type.valid( 2 ) ).to.be.false;
		expect( type.valid( 3.0001 ) ).to.be.false;
		expect( type.valid( 3.001 ) ).to.be.true;

		expect( type.valid( '5' ) ).to.be.false;
		expect( type.valid( '4.0001' ) ).to.be.false;
		expect( type.valid( '2' ) ).to.be.false;
		expect( type.valid( '3.0001' ) ).to.false;
		expect( type.valid( '3.001' ) ).to.false;

		expect( type.valid( Math.PI ) ).to.be.false;
		expect( type.valid( parseFloat( Math.PI.toPrecision( type.precision ) ) ) ).to.be.true;

		done();
	} );
} );
