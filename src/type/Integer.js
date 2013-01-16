	define( 'type.Integer', {
// class configuration
		alias  : 'int integer',
		extend : __lib__.type.Number,
// public methods
		valid  : function( v ) { return this.parent( arguments ) && Math.floor( v ) === v; },
// internal methods
		value  : function( v ) { return Math.round( this.parent( arguments ) ); }
	} );
