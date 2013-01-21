	util.iter( PACKAGE ) || ( PACKAGE = util.ENV == 'commonjs' ? module : util.global );

	if ( util.iter( PACKAGE[Name] ) ) {
		if ( is_obj( Object.value( PACKAGE, Name + '.api' ) ) )
			api  = PACKAGE[Name].api;

		if ( is_num( Object.value( PACKAGE, Name + '.DECIMAL_PRECISION' ) ) )
			DECIMAL_PRECISION = PACKAGE[Name].DECIMAL_PRECISION;

		if ( is_num( Object.value( PACKAGE, Name + '.MAX_ARRAY_LENGTH' ) ) )
			MAX_ARRAY_LENGTH = PACKAGE[Name].MAX_ARRAY_LENGTH;

		if ( Object.value( PACKAGE, Name + '.STRICT' ) ) {
			STRICT = PACKAGE[Name].STRICT;
			if ( !( STRICT in STRICT_MODE ) && !~STRICT_MODE_VAL.indexOf( STRICT ) )
				STRICT = STRICT_MODE.FALLBACK;
		}

		delete PACKAGE[Name];
	}


	util.defs( ( __lib__ = util.expose( __lib__, Name, PACKAGE ) ), {
		DECIMAL_PRECISION : DECIMAL_PRECISION,
		MAX_ARRAY_LENGTH  : MAX_ARRAY_LENGTH,
		STRICT_MODE       : { value : STRICT_MODE },
		STRICT            : STRICT,

		api               : { value : api },
		lib               : { value : lib },

		create            : create,
		define            : define,
		error             : error,
		get               : get,
		lookup            : lookup
	}, 'w', true );

	util.x( Object, Array, Boolean, Function );
