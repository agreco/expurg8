typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Date', function() {
	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : Date.now() };
		try {
			expect( expurg8.create( 'date', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Date: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Date' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return new Date( 2012, 0, 1 ) },
			max      : new Date( 2011, 0, 1 ),
			min      : new Date( 2010, 0, 1 )
		};
		try {
			expect( expurg8.create( 'date', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Date: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Date' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( 'date' );
		expect( type.contingency ).to.be.a( 'date' );
		expect( +type.contingency ).to.equal( Date.now() );

		type = expurg8.create( 'date', { fallback : '2012-01-01T00:00:00.000Z' } );
		expect( +type.contingency ).to.equal( +( new Date( 2012, 0, 1 ) ) );

		type = expurg8.create( 'date', {
			contingency : 'will not be set',
			fallback    : '2012-01-01',
			format      : 'Y-m-d'
		} );
		expect( +type.contingency ).to.equal( +( new Date( 2012, 0, 1 ) ) );
		
		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'date' );

		expect( +type.coerce( '2012-01-01T00:00:00.000Z' ) ).to.equal( +( new Date( 2012, 0, 1 ) ) );
		expect( type.coerce( '2012-01-01T00:00:00.000Z' ) ).to.be.a( 'date' );

//		type = expurg8.create( 'date', { format : 'Y-m-d' } );
//		expect( +type.coerce( '2012-01-01T00:00:00.000Z' ) ).to.equal( +( new Date( 2012, 0, 1 ) ) );
//		expect( type.coerce( '2012-01-01T00:00:00.000Z' ) ).to.be.a( 'date' );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'date', {
			fallback : '2010-03-01',
			format   : 'Y-m-d',
			max      : new Date( 2011, 0, 1 ),
			min      : new Date( 2010, 0, 1 )
		} );

		expect( type.valid( '2010-05-01' ) ).to.be.false;
		expect( type.valid( new Date( 2012, 0, 1 ) ) ).to.be.false;
		expect( type.valid( new Date( 2011, 0, 1 ) ) ).to.be.true;
		expect( type.valid( new Date( 2010, 0, 1 ) ) ).to.be.true;
		expect( type.valid( new Date( 2010, 6, 1 ) ) ).to.be.true;

		done();
	} );
} );
