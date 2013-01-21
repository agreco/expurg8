	define( 'Schema.Property', {
// class configuration
		alias        : 'property',
		extend       : __lib__.Sanitizer,
		mixins       : {
			minmax   : Name + '.validation.MinMax'
		},
// public properties
		_id          : null,
		_path        : null,
		cite         : null,
		type         : null,
// public methods
	// this can be over-written to allow further customisation of a value before being passed back to the Schema
		coerce       : function( v ) {
			return this.type.coerce( v );
		},
		sanitize     : function( accumulator ) {
			var v = this.value( accumulator.data );

			v = this.hasMany
			  ? this.$mx.minmax.coerce.call( this, v ) //mixin( 'minmax', [v] )
			  : this.coerce( v );

			this.assign( accumulator.value, v );

			return accumulator;
		},
		valid        : function( data ) {
			var v = Object.value( data, this.id );
			return this.mixin( 'minmax', [v] ) && ( this.hasMany ? v.every( this.type.valid, this ) : this.type.valid( v ) );
		},
// internal methods
		assign       : function( val, v ) {
			var root = this._path ? util.bless( this._path, val ) : val;

			root[this._id] = v;

			return val;
		},
		init         : function()    {
			this.initMappings( this.cite, this.id )
				.initType( this.type )
				.parent()
				.mixin( 'minmax' );
		},
		initMappings : function( cite, id ) {
			if ( !is_str( cite ) && !is_num( cite ) )
				cite = id;

			this.cite = cite;
			this.id   = id;

			if ( is_str( id ) && !!~id.indexOf( '.' ) ) {
				var path  = id.split( '.' );
				this._id  = path.pop();

				if ( path.length )
					this._path = path.join( '.' );
			}
			else this._id = this.id;
		},
		initType     : function( t ) {
			var cname, type = is_type( t ) || is_schema( t ) ? t : null;

			if ( !type ) {
				switch ( util.ntype( t ) ) {
					case 'string' : type = lookup( t ); break;
					case 'object' :
						if ( 'type' in t ) {
							cname = t.type; delete t.type;
							type  = create( cname, t );
						}
						else type = create( t );
						break;
				}
			}

			this.type = type;
//                                          // `util` — m8 — is a Function that returns the first parameter in its
//			if ( is_schema( this.type ) ) // `arguments` "Array": in the case that `type` is a Schema, we want to pass
//				this.value = util;        // the `accumulator` itself; not the unprocessed value to the Schema.
		},
		test         : function()    { // NB we don't need to test the type as it will test itself on instantiation
			return ( is_type( this.type ) || is_schema( this.type ) )
				&& ( is_str( this._id )   || is_num( this._id ) )
				&& this.mixin( 'minmax' );
		},
		value        : function( v ) {
			var val = Object.value( v, this.cite );

			return this.hasMany ? is_arr( val ) ? val : [val] : val;
		}
	} );
