	define( 'type.Collection', {
// class configuration
		alias      : 'collection',
		extend     : __lib__.type.Array,
// public properties
		itemType   : null,
// public methods
		coerce     : function( v ) {
			v = this.parent( v, true );

			var i = -1, l = v.length;
			while ( ++i < l ) v[i] = this.coerceItem( v[i] );

			return this.valid( v ) ? v : this.contingency;
		},
		valid      : function( v ) {
			return this.parent( arguments ) && v.every( this.validItem, this );
		},
// internal methods
		coerceItem : function( v ) {
			return this.itemType.coerce( v );
		},
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
		test       : function()    {
			return this.itemType instanceof __lib__.Sanitizer && this.parent();
		},
		validItem  : function( v ) {
			return this.itemType.valid( v );
		}
	} );
