	define( 'type.Array', {
// class configuration
		alias     : '[] array',
		extend    : __lib__.type.Object,
// public properties
		max       : __lib__.MAX_ARRAY_LENGTH,
		min       : 0,
// public methods
		coerce    : function( v, novalidate ) {
			v = this.prune( this.value( arguments ) );

			return novalidate === true || this.valid( v ) ? v : this.contingency;
		},
		valid     : function( v ) {
			return this.parent( arguments )
				&& v.length <= this.max
				&& v.length >= this.min;
		},
// internal methods
		fallback  : function()    { return []; },
		init      : function()    {
			this.parent();

			this.max = this.max >>> 0;
			this.min = this.min >>> 0;
		},
		prune     : function( v ) {
			if ( v.length > this.max ) // if the length of the coerced Array is greater than the max
				v.length = this.max;   // length allowed, we can simply crop it down before validating.

			if ( v.length < this.min ) {
				var extra = this.contingency.slice( 0, this.min - v.length );
				v.push.apply( v, extra );
			}

			return v;
		},
		test      : function()    {
			return is_int( this.max )
				&& is_int( this.min )
				&& this.max <= __lib__.MAX_ARRAY_LENGTH
				&& this.min >= 0 // we can't have negative Array lengths silly — nb. "silly" refers to YOU, not me. ;^)
				&& this.max >= this.min
				&& this.parent();
		},
		validType : is_arr,
		value     : function( v ) { return this.validType( v ) ? v : Array.coerce( v ); }
	} );
