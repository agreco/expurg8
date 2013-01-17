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
		var config = { fallback : UNDEF };
		try {
			expect( expurg8.create( 'string', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.String: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.String' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return 'a'; },
			max      : .13,
			min      : .7
		};
		try {
			expect( expurg8.create( 'string', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.String: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.String' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return ''; },
			max      : 4,
			min      : 5
		};
		try {
			expect( expurg8.create( 'string', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.String: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.String' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return 'ab'; },
			max      : 4,
			min      : 3
		};
		try {
			expect( expurg8.create( 'string', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.String: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.String' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return 'abc'; },
			pattern  : /[A-Z]+/
		};
		try {
			expect( expurg8.create( 'string', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.String: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.String' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( 'string' );
		expect( type.contingency ).to.be.a( 'string' );
		expect( type.contingency ).to.equal( '' );

		type = expurg8.create( 'string', { fallback : function() { return 'abc'; } } );
		expect( type.contingency ).to.equal( 'abc' );

		type = expurg8.create( 'string', {
			contingency : 'will not be set',
			fallback    : function() { return 'def'; },
			max         : 3
		} );
		expect( type.contingency ).to.equal( 'def' );

		type = expurg8.create( 'string', {
			fallback    : function() { return 'LMNO'; },
			pattern     : /[L-Z]{3,4}/,
			min         : 3
		} );
		expect( type.contingency ).to.equal( 'LMNO' );

		type = expurg8.create( 'string', {
			fallback    : function() { return 'lmno'; },
			flags       : 'i',
			pattern     : '[L-Z]{3,4}',
			min         :  3
		} );
		expect( type.contingency ).to.equal( 'lmno' );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'string', {
				fallback : ( new Array( 625 ) ).join( 'abacadab' ),
				max      : 10000,
				min      : 1000
			} ),
			test_str = ( new Array( 1000 ) ).join( '*' );

		expect( type.coerce( null ) ).to.equal( type.contingency );
		expect( type.coerce( '' ) ).to.equal( type.contingency.substring( 0, type.min ) );
		expect( type.coerce( test_str ) ).to.equal( test_str + 'a' );

		type = expurg8.create( 'string', {
			fallback : 'something like a phenomenon',
			flags    : 'gi',
			pattern  : /like/
		} );
		expect( type.coerce( 'frank\'s house' ) ).to.equal( type.contingency );
		expect( type.coerce( 'i like turtles' ) ).to.equal( 'i like turtles' );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'string', {
				fallback : ( new Array( 625 ) ).join( 'abacadab' ),
				max      : 10000,
				min      : 1000
			} ),
			test_str = ( new Array( 1000 ) ).join( '*' );

		expect( type.valid( null ) ).to.be.false;
		expect( type.valid( '' ) ).to.be.false;
		expect( type.valid( test_str ) ).to.be.false;
		expect( type.valid( test_str + '**' ) ).to.be.true;

		type = expurg8.create( 'string', {
			fallback : 'something like a phenomenon',
			flags    : 'gi',
			pattern  : /like/
		} );
		expect( type.valid( 'frank\'s house' ) ).to.be.false;
		expect( type.valid( 'i like turtles' ) ).to.be.true;
		expect( type.valid( 'i do not dislike turtles' ) ).to.be.true;

		done();
	} );
} );
