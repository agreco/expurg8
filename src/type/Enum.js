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
		test     : function()    {
			return is_arr( this.list ) && this.parent();
		}
	} );
