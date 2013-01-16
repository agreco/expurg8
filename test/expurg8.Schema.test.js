typeof m8      !== 'undefined' || ( m8      = require( 'm8' ) );

if ( m8.ENV === 'commonjs' ) {
	require( 'd8' );
	require( 'd8/locale/en-GB' );
}

typeof expurg8 !== 'undefined' || ( expurg8 = require( '../expurg8' ) );
typeof chai    !== 'undefined' || ( chai    = require( 'chai' ) );
typeof expect  != 'undefined'  || ( expect  = chai.expect );

suite( 'expurg8.Schema', function() {
	suite( 'coerce', function() {
		test( 'basic', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'object => array', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'array => object', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'configuration => localStorage', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'localStorage => configuration', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

	} );

	suite( 'valid', function() {
		test( 'recursive validation', function( done ) {
			expect( true ).to.be.true;
			done();
		} );
	} );

	suite( 'properties', function() {
		test( 'basic', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'single level + property instance config over-writes', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'property inheritance', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'property inheritance + property instance config over-writes', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		suite( 'property validation', function() {
			test( 'min/max items', function( done ) {
				expect( true ).to.be.true;
				done();
			} );
		} );

		suite( 'property mappings', function() {
			suite( 'no `cite` attribute and using', function() {
				test( 'single-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'single-level `id` attribute with period in it', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'multi-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );
			} );

			suite( 'single-level `cite` attribute and using:', function() {
				test( 'single-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'single-level `id` attribute with period in it', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'multi-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );
			} );

			suite( 'single-level `cite` attribute with period in it and using:', function() {
				test( 'single-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'single-level `id` attribute with period in it', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'multi-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );
			} );

			suite( 'multi-level `cite` attribute with period in it and using:', function() {
				test( 'single-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'single-level `id` attribute with period in it', function( done ) {
					expect( true ).to.be.true;
					done();
				} );

				test( 'multi-level `id` attribute', function( done ) {
					expect( true ).to.be.true;
					done();
				} );
			} );
		} );
	} );

	suite( 'using schemas as custom types within other schema', function() {
		test( 'using a schema as a custom type for a property', function( done ) {
			expect( true ).to.be.true;
			done();
		} );

		test( 'using a schema as a custom `itemType` for a collection', function( done ) {
			expect( true ).to.be.true;
			done();
		} );
	} );

	suite( 'nested schemas', function() {
		test( 'coercion with nested schemas', function( done ) {
			expect( true ).to.be.true;
			done();
		} );
	} );
} );
