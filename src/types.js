


/*~  src/type/Object.js  ~*/

	define( 'type.Object', {
// class configuration
		alias       : '{} auto mixed object',
		extend      : __lib__.Sanitizer,
// public properties
		contingency : {
			get     : function()    { return is_fun( this.fallback ) ? this.fallback() : this.fallback; },
			set     : function( v ) {
				error( 'warning', {
					instance  : this,
					message   : this.constructor[__classname__] + ': Over-writing `contingency` property is not allowed, please use the `fallback` property instead.'
				} );
				return v;
			}
		},
		fallback    : null,
// public methods
		coerce      : function( v ) { return this.valid( v = this.value( v ) ) ? v : this.contingency; },
		stringify   : function( v ) { return JSON.stringify( this.coerce( v ) ); },
		valid       : function( v ) { return this.validType( v ); },
// internal methods
		test        : function()    { return this.valid( this.contingency ); },
		validType   : function( v ) { return v !== UNDEF; },
		value       : function( v ) { return v === UNDEF ? this.contingency : v; }
	} );



/*~  src/type/Boolean.js  ~*/

	define( 'type.Boolean', {
// class configuration
		alias     : 'bool boolean',
		extend    : __lib__.type.Object,
// public properties
		fallback  : false,
// internal methods
		validType : is_bool,
		value     : Boolean.coerce
	} );



/*~  src/type/Number.js  ~*/

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
		valid     : function( v, nocast ) {
			if ( !is_num( v ) ) return false;

			var i = nocast === true ? v : int_from( v, this.precision );

			return this.parent( arguments )
				&& i <= this.max
				&& i >= this.min
				&& ( nocast === true || int_undo( i, this.precision ) === v );
		},
// internal methods
		init      : function() {
			this.parent();

			if ( !is_num( this.precision ) )
				this.precision = __lib__.DECIMAL_PRECISION;

			this.precision = Math.abs( Math.round( this.precision ) );

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
				&& Math.abs( this.precision ) === this.precision
				&& this.parent();
		},
		validType : is_num,
		value     : function( v ) { return int_from( v, this.precision ); }
	} );



/*~  src/type/Integer.js  ~*/

	define( 'type.Integer', {
// class configuration
		alias     : 'int integer',
		extend    : __lib__.type.Number,
// public properties
		precision : 0,
// public methods
		valid     : function( v ) { return this.parent( v, true ) && Math.floor( v ) === v; },
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
		value     : function( v ) { return Math.round( this.parent( arguments ) ); }
	} );



/*~  src/type/Array.js  ~*/

	define( 'type.Array', {
// class configuration
		alias     : '[] array',
		extend    : __lib__.type.Object,
// public properties
		max       : __lib__.MAX_ARRAY_LENGTH,
		min       : 0,
// public methods
		coerce    : function( v, novalidate ) {
			v = this.prune( this.value( v ) );

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



/*~  src/type/Collection.js  ~*/

	define( 'type.Collection', {
// class configuration
		alias      : 'collection',
		extend     : __lib__.type.Array,
// public properties
		itemType   : 'object',
// public methods
		coerce     : function( v ) {
			v = this.parent( v, true );

			var i = -1, l = v.length;
			while ( ++i < l ) v[i] = this.coerceItem( v[i] );

			return this.valid( v ) ? v : this.contingency;
		},
		valid      : function( v ) { return this.parent( arguments ) && v.every( this.validItem, this ); },
// internal methods
		coerceItem : function( v ) { return this.itemType.coerce( v ); },
		init       : function()    {
			this.parent();

			var item_type = this.itemType;

			switch ( util.ntype( item_type ) ) {
				case 'string'   : item_type = lookup( item_type ); break;
				case 'object'   :
					if ( !( item_type instanceof __lib__.Sanitizer ) )
						item_type = create( item_type );
					break;
				default         : item_type = null;
			}

	// we don't want this to be changed willy-nilly so make it read-only
			util.def( this, 'itemType', { value : item_type }, 'e', true );
		},
		test       : function()    { return this.itemType instanceof __lib__.Sanitizer && this.parent(); },
		validItem  : function( v ) { return this.itemType.valid( v ); }
	} );



/*~  src/type/String.js  ~*/

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



/*~  src/type/Enum.js  ~*/

	define( 'type.Enum', {
// class configuration
		alias    : 'enum',
		extend   : __lib__.type.Object,
// public properties
		list     : null,
		inverted : false,
// public methods
		valid    : function( v ) {
			var in_list = !!~this.list.indexOf( v );

			return this.parent( arguments ) && ( this.inverted === true ? !in_list : in_list );
		},
// internal methods
		fallback : function()    { return this.list[0]; },
		init     : function()    {
			this.parent();

			if ( is_str( this.list ) )
				this.list = this.list.split( ' ' );
		},
		test     : function()    { return is_arr( this.list ) && this.parent(); }
	} );



/*~  src/type/Date.js  ~*/

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



