	define( 'type.String', {
// class configuration
		alias     : 'str string',
		extend    : __lib__.type.Array,
// public properties
		fallback  : '',
		flags     : null,
		pattern   : null,
		trim      : true,
// public methods
		valid     : function( v ) { return this.parent( arguments ) && this.validStr( v ); },
// internal methods
		init      : function()    {
			this.parent();

			if ( is_str( this.pattern ) )
				this.pattern = new RegExp( this.pattern, is_str( this.flags ) ? this.flags : '' );

			if ( is_re( this.pattern ) )
				this.validStr = test_str;
			else
				this.pattern = null;
		},
		prune     : function( v ) {
			if ( v.length > this.max )
				v = v.substring( 0, this.max );

			return v;
		},
		validStr  : return_true,
		validType : is_str,
		value     : function( v ) {
			v = is_str( v ) ? v : String( v );

			v = this.trim === false ? v : v.trim();

			return v;
		}
	} );
