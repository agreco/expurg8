	if ( is_obj( Object.value( PACKAGE, Name + '.api' ) ) ) {
		api  = PACKAGE[Name].api;
		delete PACKAGE[Name];
	}
	else api = util.obj();

	if ( !is_obj( api.date ) ) {
		if ( is_fun( Date.coerce ) ) // make sure d8 is loaded
			api.date = {
				default_format : 'c',
				between        : function( date, gt, lt ) { return date.between( gt, lt ); },
				coerce         : function( date, format ) { return Date.coerce( date, format ); },
				format         : function( date, format ) { return date.format( format ); }
			};
		else
			error( 'error', '{Name}.api.date not detected, please supply an API for Date parsing and formatting or include the default: https://github.com/constantology/d8' );
	}
