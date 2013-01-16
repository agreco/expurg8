


/*~  src/error/Exception.js  ~*/

	define( 'error.Exception', {
		constructor : function Exception( error ) {
			if ( is_obj( error ) ) {
				if ( error.instance )
					error.classname = error.instance.constructor[__classname__];

				!is_fun( Error.captureStackTrace ) || Error.captureStackTrace( this, error.trace || this.constructor );

				delete error.trace;

				util.copy( this, error );
			}
			else
				this.message = String( error );

			this.parent( this.constructor[__classname__] + ': ' + this.message );
		},
		alias       : 'error exception',
		extend      : Error,
		name        : 'Expurg8Exception',
		trace       : { get : function() {
			return is_str( this.stack ) ? this.stack.split( re_split_stack ).invoke( 'trim' ) : [];
		} },
		toString    : function() { return this.message; }
	} );




/*~  src/error/RangeException.js  ~*/

	define( 'error.RangeException', {
		alias  : 'rangeerror rangeexception',
		extend : error.Exception,
		name   : 'Expurg8RangeException'
	} );



/*~  src/error/TypeException.js  ~*/

	define( 'error.TypeException', {
		alias  : 'typeerror typeexception',
		extend : error.Exception,
		name   : 'Expurg8TypeException'
	} );



/*~  src/error/Warning.js  ~*/

	define( 'error.Warning', {
		alias  : 'warning',
		extend : error.Exception,
		name   : 'Expurg8Warning'
	} );



