	define( 'type.Number', {
// class configuration
		alias     : 'num number',
		extend    : __lib__.type.Object,
// public properties
		fallback  :  0,
		max       :  Number.MAX_VALUE,
		min       : -Number.MAX_VALUE,
// public methods
		coerce    : function( v ) {
			v = this.value( v );

			if ( v > this.max ) v = this.max;
			if ( v > this.min ) v = this.min;

			return this.parent( v );
		},
		valid     : function( v ) {
			return this.parent( arguments )
				&& v <= this.max
				&& v >= this.min;
		},
// internal methods
		init      : function() {
			this.parent();

			switch ( util.ntype( this.fallback ) ) {
				case 'number' : case 'function' : break;
				default       : this.fallback = this.value( this.fallback );
			}

			this.max = this.value( this.max );
			this.min = this.value( this.min );
		},
		test      : function() {
			return this.valid( this.max )
				&& this.valid( this.min )
				&& this.parent();
		},
		validType : is_num,
		value     : parseFloat
	} );
