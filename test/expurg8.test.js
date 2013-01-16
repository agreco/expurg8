typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8', function() {
	var temp = m8.obj();

	suite( 'create', function() {
		test( 'type', function( done ) {
			var type = {
				obj  : expurg8.create( '{}' ),
				bool : expurg8.create( 'bool' ),
				date : expurg8.create( 'date' ),
				enum : expurg8.create( 'enum', { list : 'a b c' } ),
				num  : expurg8.create( 'num' ),
				int  : expurg8.create( 'int' ),
				arr  : expurg8.create( '[]' ),
				col  : expurg8.create( 'string[]' ),
				str  : expurg8.create( 'str' )
			};

			Object.values( type ).forEach( function( t ) {
				expect( t ).to.be.an.instanceof( expurg8.type.Object );
			} );

			done();
		} );

		test( 'property', function( done ) {
			expect( expurg8.create( 'property', { id : 'foo', type : 'string' } ) ).to.be.an.instanceof( expurg8.Schema.Property );

			done();
		} );

		test( 'schema', function( done ) {
			expect( expurg8.create( 'schema', {
				properties : { id : 'string' }
			} ) ).to.be.an.instanceof( expurg8.Schema );

			expect( expurg8.create( 'schema', {
				properties : [ { id : 'id', type : 'string' } ]
			} ) ).to.be.an.instanceof( expurg8.Schema );

			done();
		} );
	} );

	suite( 'define', function() {
		test( 'type', function( done ) {
			expect( expurg8.define( '^temp.define.test.Type', {
				alias  : 'temp:type',
				extend : 'expurg8.type.Object',
				module : temp
			} ).prototype ).to.be.an.instanceof( expurg8.type.Object );

			done();
		} );

		test( 'property', function( done ) {
			expect( expurg8.define( '^temp.define.test.Property', {
				alias  : 'temp:property',
				extend : 'expurg8.Schema.Property',
				module : temp
			} ).prototype ).to.be.an.instanceof( expurg8.Schema.Property );

			done();
		} );

		test( 'schema', function( done ) {
			expect( expurg8.define( '^temp.define.test.Schema', {
				alias  : 'temp:schema',
				extend : 'expurg8.Schema',
				module : temp
			} ).prototype ).to.be.an.instanceof( expurg8.Schema );

			done();
		} );
	} );

	suite( 'error', function() {
		test( 'Exception', function( done ) {
			try {
				expect( expurg8.error( {
					message : '{Name}: Test {Name}.error.Exception'
				} ) ).to.throw( expurg8.error.Exception );
			} catch( e ) {
				expect( e ).to.be.an.instanceof( expurg8.error.Exception );
				expect( e.message ).to.equal( 'expurg8: Test expurg8.error.Exception' )
			}

			done();
		} );

		test( 'TypeException', function( done ) {
			try {
				expect( expurg8.error( 'typeerror', {
					message : '{Name}: Test {Name}.error.TypeException'
				} ) ).to.throw( expurg8.error.TypeException );
			} catch( e ) {
				expect( e ).to.be.an.instanceof( expurg8.error.TypeException );
				expect( e.message ).to.equal( 'expurg8: Test expurg8.error.TypeException' )
			}

			done();
		} );

		test( 'RangeException', function( done ) {
			try {
				expect( expurg8.error( 'RangeError', {
					message : '{Name}: Test {Name}.error.RangeException'
				} ) ).to.throw( expurg8.error.RangeException );
			} catch( e ) {
				expect( e ).to.be.an.instanceof( expurg8.error.RangeException );
				expect( e.message ).to.equal( 'expurg8: Test expurg8.error.RangeException' )
			}

			done();
		} );

		test( 'Warning', function( done ) {
			try {
				expect( expurg8.error( 'warning', {
					message : '{Name}: Test {Name}.error.Warning'
				} ) ).to.be.undefined;
			} catch( e ) { // this should not be called so if it is, it will fail because it will be an instance of a Warning
				expect( e ).to.not.be.an.instanceof( expurg8.error.Warning );
			}

			done();
		} );
	} );

	suite( 'get', function() {
		test( 'type', function( done ) {
			var type = expurg8.create( 'expurg8.type.Object', { id : 'type:test' } );

			expect( expurg8.get( 'type:test' ) ).to.equal( type );

			expect( expurg8.get( 'type:test.does.not.exist' ) ).to.equal( null );

			done();
		} );

		test( 'property', function( done ) {
			var property = expurg8.create( 'expurg8.Schema', { id : 'schema:test', properties : [{ id : 'property:test', type : 'string' }] } ).properties[0];

			expect( expurg8.get( 'schema:test:property:test' ) ).to.equal( property );

			expect( expurg8.get( 'property:test' ) ).to.equal( null );

			done();
		} );

		test( 'schema', function( done ) {
			expect( expurg8.get( 'schema:test' ) ).to.be.an.instanceof( expurg8.Schema );

			expect( expurg8.get( 'schema:test.does.not.exist' ) ).to.equal( null );

			done();
		} );
	} );

	suite( 'lookup', function() {
		test( 'type : existing by id', function( done ) {
			expect( expurg8.lookup( 'type:test' ) ).to.be.an.instanceof( expurg8.type.Object );

			try {
				expect( expurg8.lookup( 'type:test.does.not.exist' ) ).to.throw( expurg8.error.Exception );
			}
			catch( e ) {
				expect( e.message ).to.equal( 'expurg8.create: No Class found with name: type:test.does.not.exist.' );
			}

			done();
		} );

		test( 'type : new with config object', function( done ) {
			expect( expurg8.lookup( { classname : '[]', id : 'type:test:lookup' } ) ).to.be.an.instanceof( expurg8.type.Array );

			expect( expurg8.lookup( { id : 'type:test:lookup.does.not.exist' } ) ).to.equal( null );

			done();
		} );

		test( 'property : existing by id', function( done ) {
			expect( expurg8.lookup( 'schema:test:property:test' ) ).to.be.an.instanceof( expurg8.Schema.Property );

			try {
				expect( expurg8.lookup( 'property:test' ) ).to.throw( expurg8.error.Exception );
			}
			catch( e ) {
				expect( e.message ).to.equal( 'expurg8.create: No Class found with name: property:test.' );
			}

			done();
		} );

		test( 'property : new with config object', function( done ) {
			expect( expurg8.lookup( { classname : 'property', id :'id', type : '[]' } ) ).to.be.an.instanceof( expurg8.Schema.Property );

			expect( expurg8.lookup( { id : 'property:test:lookup.does.not.exist' } ) ).to.equal( null );
			done();
		} );

		test( 'schema : existing by id', function( done ) {
			expect( expurg8.lookup( 'schema:test' ) ).to.be.an.instanceof( expurg8.Schema );

			try {
				expect( expurg8.lookup( 'schema:test.does.not.exist' ) ).to.throw( expurg8.error.Exception );
			}
			catch( e ) {
				expect( e.message ).to.equal( 'expurg8.create: No Class found with name: schema:test.does.not.exist.' );
			}

			done();
		} );

		test( 'schema : new with config object', function( done ) {
			expect( expurg8.lookup( { classname : 'schema', id :'schema:test:lookup', properties : [{ id : 'id', type : 'string' }] } ) ).to.be.an.instanceof( expurg8.Schema );

			expect( expurg8.lookup( { id : 'schema:test:lookup.does.not.exist' } ) ).to.equal( null );

			done();
		} );
	} );
} );
