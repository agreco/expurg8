
//	function capitalize( str ) {
//		str = String( str );
//		return str.charAt( 0 ).toUpperCase() + str.substring( 1 );
//	}

	function is_arr(  v )   { return util.ntype( v ) == 'array'; }
	function is_bool( v )   { return util.ntype( v ) == 'boolean'; }
	function is_date( v )   { return util.ntype( v ) == 'date' && !isNaN( +v ); }
	function is_fun( v )    { return util.ntype( v ) == 'function'; }
	function is_num( v )    { return util.type(  v ) == 'number'; }
	function is_obj( v )    { return util.ntype( v ) == 'object'; }
	function is_prop( v )   { return v instanceof __lib__.Schema.Property; }
	function is_re( v )     { return util.ntype( v ) == 'regexp'; }
	function is_str( v )    { return util.ntype( v ) == 'string'; }
	function is_schema( v ) { return v instanceof __lib__.Schema; }
	function is_type( v )   { return v instanceof __lib__.type.Object; }

	function namespace( ClassName ) { return '^' + Name + '.' + ClassName; }

	function return_true()  { return true; }

	function test_str( v )  { return this.pattern.test( v ); }

//	function to_obj( val, prop ) {
//		val[prop] = true;
//		return val;
//	}
