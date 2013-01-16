	define( 'type.Object', {
// class configuration
		alias       : '{} auto mixed object',
		extend      : __lib__.Sanitizer,
// public properties
		contingency : {
			get     : function()    { return is_fun( this.fallback ) ? this.fallback() : this.fallback; },
			set     : function( v ) {
				console.warn( this.constructor[__classname__] + ': Over-writing `contingency` property is not allowed, please use the `fallback` property instead.' );
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
