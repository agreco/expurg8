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
		coerce       : function( accumulator ) {
			accumulator instanceof Accumulator || error( 'typeerror', {
				classname : this.constructor[__classname__],
				config    : accumulator,
				instance  : this,
				message   : util.format( '{Name}.Schema.Property#coerce: expected instance of private Class — Accumulator — not: {0}', accumulator )
			} );

			var v = this.value( accumulator.data );

			v = this.hasMany
			  ? this.mixin( 'minmax', [v] )
			  : this.type.coerce( v );

			this.assign( accumulator.value, v );

			return accumulator;
		},
		valid        : function( v ) { return this.mixin( 'minmax', arguments ); },
// internal methods
		assign       : function( val, v ) {
			var root = is_arr( this._path ) ? util.bless( this._path, val ) : val;

			root[this._id] = v;

			return val;
		},
		init         : function()    {
			this.initType( this.type )
				.initMappings( this.cite, this.id )
				.mixin( 'minmax' );
		},
		initMappings : function( cite, id ) {
			if ( !is_str( cite ) )
				cite = id;

			this.cite = cite;
			this.id   = id;

			if ( is_str( id ) && !!~id.indexOf( '.' ) ) {
				var path  = id.split( '.' );
				this._id  = path.pop();

				if ( path.length )
					this._path = path;
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
		},
		test         : function()    { // NB we don't need to test the type as it will test itself on instantiation
			return ( is_type( this.type ) || is_schema( this.type ) )
				&& ( is_str( this._id )   || is_num( this._id ) )
				&& this.mixin( 'minmax' );
		},
		value        : function( v ) { return Object.value( v, this.cite ); }
	} );
