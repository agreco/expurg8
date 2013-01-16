	util.iter( PACKAGE ) || ( PACKAGE = util.ENV == 'commonjs' ? module : util.global );

	if ( is_obj( Object.value( PACKAGE, Name + '.api' ) ) ) {
		api  = PACKAGE[Name].api;
		delete PACKAGE[Name];
	}

	util.defs( ( __lib__ = util.expose( __lib__, Name, PACKAGE ) ), {
		MAX_ARRAY_LENGTH : MAX_ARRAY_LENGTH,
		api              : { value : api },
		lib              : { value : lib },

		create           : create,
		define           : define,
		error            : error,
		get              : get,
		lookup           : lookup
	}, 'w', true );

	util.x( Object, Array, Boolean, Function );
