	define( 'type.Integer', {
// class configuration
		alias     : 'int integer',
		extend    : __lib__.type.Number,
// public properties
		precision : 0,
// public methods
		valid     : function( v ) {
			return this.parent( v, true ) && Math.floor( v ) === v;
		},
// internal methods
		init      : function()    {
			var max = this.max, min = this.min;

			this.precision = 0;

			this.parent( arguments );

	// since we want our Types to be instantiated with as much correctness as possible,
	// we don't want to cast our max/min as Integers
			if ( max !== Number.POSITIVE_INFINITY )
				this.max = max;
			if ( min !== Number.NEGATIVE_INFINITY )
				this.min = min;

		},
		value     : function( v ) {
			return Math.round( this.parent( arguments ) );
		}
	} );
