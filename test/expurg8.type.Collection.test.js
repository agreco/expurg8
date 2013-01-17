typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.type.Collection', function() {
	function return_args() { return arguments; }

	var UNDEF;

	test( 'throws error when `test` fails', function( done ) {
		var config = { fallback : UNDEF, itemType : 'object' };
		try {
			expect( expurg8.create( 'collection', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Collection: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Collection' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return .17; },
			itemType : 'object',
			max      : .13,
			min      : .7
		};

		try {
			expect( expurg8.create( 'collection', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Collection: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Collection' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return []; },
			itemType : 'object',
			max      : 4,
			min      : 5
		};
		try {
			expect( expurg8.create( 'collection', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Collection: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Collection' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return [1,2]; },
		    itemType : 'object',
			max      : 4,
			min      : 3
		};
		try {
			expect( expurg8.create( 'collection', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Collection: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Collection' );
			expect( e.configuration ).to.equal( config );
		}

		config = {
			fallback : function() { return [1,2]; },
		    itemType : 'string'
		};
		try {
			expect( expurg8.create( 'collection', config ) ).to.throw( expurg8.error.TypeException );
		}
		catch( e ) {
			expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
			expect( e.message ).to.equal( 'expurg8.type.Collection: Invalid Configuration' );
			expect( e.classname ).to.equal( 'expurg8.type.Collection' );
			expect( e.configuration ).to.equal( config );
		}

		done();
	} );

	test( 'contingency/fallback', function( done ) {
		var type = expurg8.create( 'collection', { itemType : 'object' } );
		expect( type.contingency ).to.be.a( 'array' );
		expect( type.contingency ).to.eql( [] );
		expect( type.contingency ).to.not.equal( type.contingency );

		type = expurg8.create( 'collection', {
			contingency : 'will not be set',
			fallback    : function() { return [1,2,3]; },
			itemType    : 'int'
		} );
		expect( type.contingency ).to.eql( [1,2,3] );
		expect( type.contingency ).to.not.equal( type.contingency );

		type = expurg8.create( 'collection', {
			fallback    : function() { return [1,2,3]; },
			itemType    : 'number',
			max         : 3
		} );
		expect( type.contingency ).to.eql( [1,2,3] );
		expect( type.contingency ).to.not.equal( type.contingency );

		type = expurg8.create( 'collection', {
			fallback     : function() { return [[1,2,3],[2,3,4],[3,4,5],[4,5,6]]; },
			itemType     : 'number[]',
			min          : 3
		} );
		expect( type.contingency ).to.eql( [[1,2,3],[2,3,4],[3,4,5],[4,5,6]] );
		expect( type.contingency ).to.not.equal( type.contingency );

		type = expurg8.create( 'collection', {
			fallback     : function() { return [['a','b'],['c','d'],['e','f']]; },
			itemType     : {
				fallback : function() { return ['','']; },
				min      : 2,
				type     : 'string[]'
			},
			min          : 3
		} );
		expect( type.contingency ).to.eql( [['a','b'],['c','d'],['e','f']] );
		expect( type.contingency ).to.not.equal( type.contingency );

		type = expurg8.create( 'collection', {
			fallback     : function() { return [[1,2],[2,3],[3,4]]; },
			itemType     : {
				fallback : function() { return [0,0]; },
				itemType : 'int',
				min      : 2,
				type     : 'collection'
			},
			max          : 3
		} );
		expect( type.contingency ).to.eql( [[1,2],[2,3],[3,4]] );
		expect( type.contingency ).to.not.equal( type.contingency );

		done();
	} );

	test( 'coerce', function( done ) {
		var type = expurg8.create( 'collection', {
			fallback : function() { return [[0],[0],[0]]; },
			itemType : 'int[]',
			min      : 3
		} );

		;!function() {
			var args = type.coerce( arguments );
			expect( args ).to.be.a( 'array' );
			expect( args ).to.eql( [[1,2],[2,3],[3,4]] );
		}( [1,2],[2,3],[3,4] );

		;!function() {
			var args = type.coerce( arguments );
			expect( args ).to.be.a( 'array' );
			expect( args ).to.eql( [[1,2],[2,3],[3,4]] );
		}( return_args( 1, 2 ), return_args( 2, 3 ), return_args( 3, 4 ) );

		type = expurg8.create( 'collection', {
			fallback : function() { return [1,2,3]; },
			itemType : 'int',
			max      : 4,
			min      : 3
		} );
		expect( type.coerce( [1,2,3,4,5,6,7,8] ) ).to.eql( [1,2,3,4] );
		expect( type.coerce( [7,8] ) ).to.eql( [7,8,1] );

		done();
	} );

	test( 'valid', function( done ) {
		var type = expurg8.create( 'int[]', { fallback : function() { return [0]; } } );
		;!function() {
			expect( type.valid( arguments ) ).to.be.false;
			expect( type.valid( Array.coerce( arguments ) ) ).to.be.true;
		}( 1, 2, 3 );

		type = expurg8.create( 'collection', {
			fallback : function() { return 'a b c'.split( ' ' ); },
			itemType : {
				pattern  : /[a-k]/,
				type     : 'string'
			},
			max      : 4,
			min      : 3
		} );
		expect( type.valid( 'l m n o'.split( ' ' ) ) ).to.be.false;
		expect( type.valid( 'a b'.split( ' ' ) ) ).to.be.false;
		expect( type.valid( 'b a c k'.split( ' ' ) ) ).to.be.true;
		expect( type.valid( 'a b c'.split( ' ' ) ) ).to.be.true;

		done();
	} );
} );
