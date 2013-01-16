	define( 'type.Number', {
// class configuration
		alias     : 'num number',
		extend    : __lib__.type.Object,
// public properties
		fallback  : 0,
		max       : Number.POSITIVE_INFINITY,
		min       : Number.NEGATIVE_INFINITY,
		precision : __lib__.DECIMAL_PRECISION,
// public methods
		coerce    : function( v ) {
			v = this.value( v );

			if ( v > this.max ) v = this.max;
			if ( v < this.min ) v = this.min;

			return this.valid( v, true ) ? int_undo( v, this.precision ) : this.contingency;
		},
		valid     : function( v, skip_int ) {
			if ( !is_num( v ) ) return false;

			var i = skip_int === true ? v : int_from( v, this.precision );

			return this.parent( arguments )
				&& i <= this.max
				&& i >= this.min
				&& ( skip_int === true || int_undo( i, this.precision ) === v );
		},
// internal methods
		init      : function() {
			this.parent();

			if ( !is_num( this.precision ) )
				this.precision = __lib__.DECIMAL_PRECISION;

			this.precision = Math.round( this.precision );

			switch ( util.ntype( this.fallback ) ) {
				case 'function' : break;
				default         : this.fallback = int_undo( this.value( this.fallback ), this.precision );
			}

			if ( this.max !== Number.POSITIVE_INFINITY )
				this.max = this.value( this.max );
			if ( this.min !== Number.NEGATIVE_INFINITY )
				this.min = this.value( this.min );
		},
		test      : function() {
			return this.valid( this.max, true )
				&& this.valid( this.min, true )
				&& is_int( this.precision )
				&& this.precision <= __lib__.DECIMAL_PRECISION
				&& this.parent();
		},
		validType : is_num,
		value     : function( v ) { return int_from( v, this.precision ); }
	} );
