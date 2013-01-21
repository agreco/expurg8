	var	__classname__     = '__classname__',
//		__errors__        = '__errors__',
		__properties__    = '__properties__',
		__super__         = '__super__',
		DECIMAL_PRECISION = 17,
		MAX_ARRAY_LENGTH  = -1 >>> 0, // same as `Math.pow( 2, 32 ) - 1`
		STRICT, UNDEF,
		STRICT_MODE       = {
			ERROR         : 4,
			FALLBACK      : 1,
			WARN          : 2
		},
		STRICT_MODE_VAL   = Object.values( STRICT_MODE ),
		util              = lib.util,
		__lib__           = util.obj(),
		api, cache        = {
			Class    : util.obj(),
			instance : util.obj()
		},
		re_split_stack    = /[\r\n]+/gm;
