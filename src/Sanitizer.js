	define( 'Sanitizer', function() {
		return {
// class configuration
			constructor : function Sanitizer( config ) {
				this.parent( arguments ).test() || error( 'TypeError', {
					configuration : config,
					instance      : this,
					message       : this.constructor[__classname__] + ( this.id ? '#' + this.id : '' ) + ': Invalid Configuration'
				} );

				reg_instance( this );
			},
			alias       : null,
// public properties
			id          : null,
			strict      : __lib__.STRICT,
// public methods
			coerce      : function( v ) { return this.valid( v = this.value( v ) ) ? v : null; },
			destroy     : function()    { unreg_instance( this ).parent( arguments ); },
			sanitize    : function( accumulator ) { return accumulator; },
			valid       : function( v ) { return true; },
// internal methods
			test        : function()    { return this.valid(); },
			value       : function( v ) { return v; }
		};
	}() );
