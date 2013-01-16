	var	__classname__     = '__classname__',
		__properties__    = '__properties__',
		__super__         = '__super__',
		DECIMAL_PRECISION = 17, UNDEF,
		MAX_ARRAY_LENGTH  = Math.pow( 2, 32 ) - 1,
		util              = lib.util,
		__lib__           = util.obj(),
		api, cache        = {
			Class    : util.obj(),
			instance : util.obj()
		},
		re_split_stack    = /[\r\n]+/gm;
