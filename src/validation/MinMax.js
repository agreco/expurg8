	define( 'validation.MinMax', {
// class configuration
		alias   : 'minmax',
// public properties
		hasMany : false,
		max     : 1,
		min     : 0,
// public methods
		coerce  : function( v ) { return this.prune( v.map( this.type.coerce, this.type ) ); },
		valid   : function( v ) {
			return this.hasMany
				? is_arr( v ) && v.length >= this.min && v.length <= this.max
				: !is_arr( v ) || ( lib.is( this.type, Name + '.type.Array' ) && !lib.is( this.type, Name + '.type.String' ) );
		},
// internal methods
	// if the property is singular & not required -> min = 0, max = 1
	// if the property is singular & required     -> min = 1, max = 1
	// if the property is multiple & not required -> min = 0, max = N
	// if the property is multiple & required     -> min = M, max = N
		init    : function()    {
			this.max = this.max >>> 0;
			this.min = this.min >>> 0;

			this.hasMany = this.max > 1;
		},
		prune        : function( v ) {
			if ( v.length > this.max ) // if the length is greater than the max length allowed,
				v.length = this.max;   // we can simply crop it down before validating.

			return v;
		},
		test    : function()    {
			return is_num( this.max )   && is_num( this.min )
				&& this.max >= this.min && this.min >= 0
		}
	} );
