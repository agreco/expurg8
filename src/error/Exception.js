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

