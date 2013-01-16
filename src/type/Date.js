	define( 'type.Date', {
// class configuration
		alias     : 'date',
		extend    : __lib__.type.Object,
// public properties
		format    : api.date.default_format,
		max       :  3250368e7,   // 3000-01-01T00:00:00.000Z
		min       : -621672192e5, // 0000-01-01T00:00:00.000Z
// public methods
		coerce    : function( v ) { // todo: make this mo' efficient
			v = this.parent( arguments );

			if ( +v > +this.max ) return new Date( +this.max );
			if ( +v < +this.min ) return new Date( +this.min );

			return v;
		},
		stringify   : function( v ) { return api.date.format( this.coerce( v ), this.format ); },
		valid     : function( v ) { return this.parent( arguments ) && api.date.between( v, this.min, this.max ); },
// internal methods
		fallback  : function() { return new Date; },
		init      : function() {
			this.parent();

			if ( is_str( this.fallback ) )
				this.fallback = this.value( this.fallback );

			this.max = this.value( this.max );
			this.min = this.value( this.min );
		},
		test      : function() {
			return this.valid( this.max )
				&& this.valid( this.min )
				&& this.parent();
		},
		validType : is_date,
		value     : function( v ) {
			switch ( util.ntype( v ) ) {
				case 'date'   : return v;
				case 'number' : return new Date( v ); // assume unix timestamp
				case 'string' : return api.date.coerce( v, this.format );
			}

			return this.contingency;
		}
	} );
