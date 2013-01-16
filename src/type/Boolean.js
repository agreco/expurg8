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
