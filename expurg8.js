;!function( lib, Name, PACKAGE  ) {
	"use strict";



/*~  src/vars.js  ~*/

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



/*~  src/util.js  ~*/


//	function capitalize( str ) {
//		str = String( str );
//		return str.charAt( 0 ).toUpperCase() + str.substring( 1 );
//	}
	function int_from( n, p ) { return isNaN( n ) ? NaN : Math.round( parseFloat( n ) * parseFloat( '1e' + p ) ); }
	function int_undo( n, p ) {
		if ( isNaN( n ) ) return NaN;

		var v = parseFloat( n ) / parseFloat( '1e' + p );

		return isNaN( v ) || Math.abs( v ) === 0 || p === 0 ? v : parseFloat( v.toPrecision( p ) );
	}

	function is_arr(  v )   { return util.ntype( v ) == 'array'; }
	function is_bool( v )   { return util.ntype( v ) == 'boolean'; }
	function is_date( v )   { return util.ntype( v ) == 'date' && !isNaN( +v ); }
	function is_fun( v )    { return util.ntype( v ) == 'function'; }
	function is_int( v )    { return is_num( v ) && Math.floor( v ) === v; }
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



/*~  src/lib.js  ~*/

	function create( classname, config ) {
		if ( is_obj( classname ) && !config ) {
			config    = classname;
			classname = config.classname; delete config.classname;
			if ( !classname && config.type ) {
				classname = config.type;  delete config.type;
			}
		}

		if ( !is_obj( config ) ) config = util.obj();

		var Class, err;

		if ( is_str( classname ) ) {
			classname = classname.toLowerCase();

	// this allows passing types of string[], int[], etc, etc, to create a collection of said itemType
	// `... > 0` because type.Array has an alias of `[]`
			if ( classname.indexOf( '[]' ) > 0 && !( classname in cache.Class ) ) {
				config.itemType = classname.split( '[' )[0];
				classname       = 'collection';
			}

			Class = cache.Class[classname] || lib.get( classname ) || lib.get( namespace( classname ) );

			if ( !Class || !( Class.prototype instanceof __lib__.Sanitizer ) )
				err = '{0}.create: No Class found with name: {1}.';
		}
		else
			err = '{0}.create: Invalid Class name. Expected the name of an existing {0}.Sanitizer Class instead received: {1}';

		!err || error( {
			classname : classname, configuration : config, message : util.format( err, '{Name}', classname )
		} );

		return Class ? new Class( config ) : null;
	}

	function define( name, desc ) {
		is_obj( desc ) || error( {
			descriptor : desc,
			message    : 'Invalid Class definition',
			name       : name
		} );

		if ( !desc.module )
			desc.module = __lib__;
		if ( desc.module === __lib__ )
			name = namespace( name );

		var alias = desc.alias; delete desc.alias;

		if ( is_str( alias ) )
			alias = alias.split( ' ' );
		if ( !is_arr( alias ) )
			alias = [];

		return register( lib.define( name, desc ), alias );
	}

	function error( type, err ) {
		if ( is_obj( type ) ) {
			err  = type;
			type = err.type || 'error';
			delete err.type;
		}

		if ( !is_obj( err ) )
			err = { message : err };

		if ( is_str( err.message ) )
			err.message = util.gsub( err.message, { Name : Name } );

		if ( !is_fun( err.trace ) )
			err.trace = error;

		var Err = cache.Class[String( type ).toLowerCase()] || error.Error;

		err = new Err( err );

		if ( err instanceof __lib__.error.Warning )
			console.warn( err );
		else
			throw err;
	}

	function get( item ) {
		return item instanceof __lib__.Sanitizer ? item : cache.instance[String( item ).toLowerCase()] || null;
	}

	function lookup( item ) {
		if ( item instanceof __lib__.Sanitizer ) return item;

		switch ( util.ntype( item ) ) {
			case 'string' : return get( item = item.toLowerCase() )
							  || ( item in cache.Class ? cache.Class[item].create() : create( item ) );
			case 'object' : return 'classname' in item ? create( item ) : null;
		}

		return null;
	}

	function reg_alias( Class, alias ) {       // all aliases are stored as lowercase and all Class lookups are
		alias = String( alias ).toLowerCase(); // converted to lowercase before the lookup allow for case insensitivity.
											   // this means a string type can be of type: string|String|STRING or any
											   // other case combination without causing errors
		!( alias in cache.Class ) || error( {
			classname : Class[__classname__],
			message   : util.format( 'Cannot overwrite existing alias — {0}.', alias )
		} );

		return cache.Class[alias] = Class;
	}

	function reg_instance( instance ) {
		if ( is_str( instance.id ) ) {
			var id = instance.id.toLowerCase();

	// we don't want to cache every Schema.Property that is bound to a schema
	// because we will most probably over-write properties like: `id`.
			if ( instance instanceof __lib__.Schema.Property ) {
				if( is_str( Object.value( instance, 'schema.id' ) ) )
					id = util.format( '{0}:{1}', instance.schema.id.toLowerCase(), id );
				else
					return instance;
			}

			if ( !( id in cache.instance ) )
				cache.instance[id] = instance;
		}

		return instance;
	}

	function register( Class, aliases ) {
		aliases.unshift( Class[__classname__] );
		return aliases.reduce( reg_alias, Class );
	}

	function unreg_instance( instance ) {
		if ( is_str( instance.id) ) {
			var id = instance.id.toLowerCase();

			!( id in cache.instance ) || cache.instance[id] !== instance || delete cache.instance[id];
		}

		return instance;
	}



/*~  src/api.js  ~*/

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



/*~  src/expose.js  ~*/

	util.iter( PACKAGE ) || ( PACKAGE = util.ENV == 'commonjs' ? module : util.global );

	if ( util.iter( PACKAGE[Name] ) ) {
		if ( is_obj( Object.value( PACKAGE, Name + '.api' ) ) )
			api  = PACKAGE[Name].api;

		if ( is_num( Object.value( PACKAGE, Name + '.DECIMAL_PRECISION' ) ) )
			DECIMAL_PRECISION = PACKAGE[Name].DECIMAL_PRECISION;

		if ( is_num( Object.value( PACKAGE, Name + '.MAX_ARRAY_LENGTH' ) ) )
			MAX_ARRAY_LENGTH = PACKAGE[Name].MAX_ARRAY_LENGTH;

		delete PACKAGE[Name];
	}


	util.defs( ( __lib__ = util.expose( __lib__, Name, PACKAGE ) ), {
		DECIMAL_PRECISION : DECIMAL_PRECISION,
		MAX_ARRAY_LENGTH  : MAX_ARRAY_LENGTH,
		api               : { value : api },
		lib               : { value : lib },

		create            : create,
		define            : define,
		error             : error,
		get               : get,
		lookup            : lookup
	}, 'w', true );

	util.x( Object, Array, Boolean, Function );



/*~  src/Sanitizer.js  ~*/

	define( 'Sanitizer', function() {
		return {
// class configuration
			constructor : function Sanitizer( config ) {
				this.parent( arguments ).test() || error( 'TypeError', {
					configuration : config,
					instance      : this,
					message       : this.constructor[__classname__] + ': Invalid Configuration'
				} );

				reg_instance( this );
			},
			alias       : null,
// public properties
			id          : null,
// public methods
			coerce      : function( v ) { return this.valid( v = this.value( v ) ) ? v : null; },
			destroy     : function()    { unreg_instance( this ).parent( arguments ); },
			valid       : function( v ) { return true; },
// internal methods
			test        : function()    { return this.valid(); },
			value       : function( v ) { return v; }
		};
	}() );



/*~  src/Accumulator.js  ~*/

	function Accumulator( schema, data, value ) {
		this.schema = schema;
		this.data   = data;
		this.value  = value || ( is_arr( raw ) ? [] : util.obj() );
	}

	Accumulator.prototype = {
		constructor : Accumulator,
		data        : null,
		schema      : null,
		value       : null,
		valueOf     : function() { return this.value; }
	};



/*~  src/Schema.js  ~*/

	define( 'Schema', function() {
		function get_property_config( config, id ) { // noinspection FallthroughInSwitchStatementJS
			switch ( util.ntype( config ) ) {
				case 'function' :
					if ( is_prop( config ) )                                break;
					else if ( !is_type( config ) && !is_schema( config ) )  return null;
				//  else                                                 // allow fall-through
				case 'string'   : config = { type : config };               break;
				case 'object'   : if ( 'type' in config )                   break;
																			return null;
			}

			if ( !( 'id' in config ) )
				config.id = id;

			return config;
		}

		function to_property_array( properties, config, id ) {
			var property = get_property_config( config, id );

			if ( property === null )
				error( 'warning', {
					config    : config,
					instance  : this,
					message   : '{Name}.Schema: Invalid Property Configuration'
				} );
			else
				properties.push( property );

			return properties;
		}

		function to_property_map( properties, config, id ) {
			var property = get_property_config( config, id );

			if ( property === null )
				error( 'warning', {
					Class     : this,
					classname : this[__classname__],
					config    : config,
					message   : '{Name}.Schema: Invalid Property Configuration'
				} );
			else
				properties[property.id] = property;

			return properties;
		}

		return {
	// this handles Schema's being able to inherit their supers' `properties` correctly
		// NB. the reason we are not creating instance of Schema.Property in here is so that each property
		//     can be either over-written or have its configurations tweaked when the Schema is instantiated
			afterdefine    : function( Class ) {
				var Super = Class[__super__],
					props = Class.prototype.properties;

	// if you don't know why you don't want an Object on a prototype, then you should definitely find out.
	// Hint: Prototypical inheritance and non-primitives being passed around as references not copies...
				delete Class.prototype.properties;

				if ( is_arr( props ) )
					props = props.reduce( to_property_map.bind( Class ), util.obj() );

				if ( !is_obj( props ) )
					props = util.obj();

				util.def( Class,
						__properties__,
						{ value : is_obj( Super[__properties__] ) ? util.update( props, Super[__properties__] ) : props },
						 'r',
						  true );
			},
	// this handles allowing Schema's to have their `properties` rejigged as well as ensuring
	// any `properties` defined when the Schema was created are added to the the instance
	// without risking any of the pitfalls created from adding non-primitives to Function prototypes
			beforeinstance : function( Class, instance, args ) {
				var config = is_obj( args[0] ) ? args[0] : args[0] = { properties : util.obj() };

				if ( is_arr( config.properties ) )
					config.properties = config.properties.reduce( to_property_map.bind( Class ), util.obj() );

				if ( !is_obj( config.properties ) )
					config.properties = util.obj();

				!is_obj( Class[__properties__] ) || util.update( config.properties, Class[__properties__] );

				config.properties = Object.reduce( config.properties, to_property_array.bind( this ), [] );
			},
// class configuration
			alias          : 'schema',
			extend         : __lib__.Sanitizer,
// public properties
			cast           : null,
			properties     : null,
// public methods
			coerce         : function( v ) {
				return this.properties.reduce( this.aggregate, new Accumulator( this, v, this.value( v ) ) ).value;
			},
			valid          : function( v ) { return this.properties.every( this.validProperty, v ); },
// internal methods
			aggregate      : function( accumulator, property ) {
				property.coerce( accumulator );

				return accumulator;
			},
			init           : function()    {
	// `this.properties` should always be an Array because of the `beforeinstance` catch all
	// it should be technically impossible for it to not be an Array; the only way for it to not be would be to
	// explicitly call expurg8.Schema.Property.prototype.init without creating an instance, in which case: WHY!!??
				this.properties = this.properties.map( this.initProperty, this );
			},
			initProperty   : function( property ) {
				return is_prop( property ) ? property : create( 'property', util.copy( property, { schema : this } ) );
			},
	// NB we don't need to test each property as they will test themselves on instantiation
			test           : function()    {
				return is_arr( this.properties ) && !!this.properties.length && this.properties.every( is_prop );
			},
			validProperty  : function( property ) { return property.valid( this ); },
			value          : function( v ) {
				switch ( util.ntype( this.cast ) ) {
					case 'function' : return this.cast();
					case 'string'   : switch ( this.cast ) {
						case '{}'   : return util.obj();
						case '[]'   : return [];
					}
				}

				return is_arr( v ) ? [] : util.obj();
			}
		};
	}()  );



/*~  src/Property.js  ~*/

	define( 'Schema.Property', {
// class configuration
		alias        : 'property',
		extend       : __lib__.Sanitizer,
		mixins       : {
			minmax   : Name + '.validation.MinMax'
		},
// public properties
		_id          : null,
		_path        : null,
		cite         : null,
		type         : null,
// public methods
	// this can be over-written to allow further customisation of a value before being passed back to the Schema
		coerce       : function( accumulator ) {
			accumulator instanceof Accumulator || error( 'typeerror', {
				config    : accumulator,
				instance  : this,
				message   : util.format( '{Name}.Schema.Property#coerce: expected instance of private Class — Accumulator — not: {0}', accumulator )
			} );

			var v = this.value( accumulator.data );

			v = this.hasMany
			  ? this.mixin( 'minmax', [v] )
			  : this.type.coerce( v );

			this.assign( accumulator.value, v );

			return accumulator;
		},
		valid        : function( v ) { return this.mixin( 'minmax', arguments ); },
// internal methods
		assign       : function( val, v ) {
			var root = is_arr( this._path ) ? util.bless( this._path, val ) : val;

			root[this._id] = v;

			return val;
		},
		init         : function()    {
			this.initType( this.type )
				.initMappings( this.cite, this.id )
				.mixin( 'minmax' );
		},
		initMappings : function( cite, id ) {
			if ( !is_str( cite ) )
				cite = id;

			this.cite = cite;
			this.id   = id;

			if ( is_str( id ) && !!~id.indexOf( '.' ) ) {
				var path  = id.split( '.' );
				this._id  = path.pop();

				if ( path.length )
					this._path = path;
			}
			else this._id = this.id;
		},
		initType     : function( t ) {
			var cname, type = is_type( t ) || is_schema( t ) ? t : null;

			if ( !type ) {
				switch ( util.ntype( t ) ) {
					case 'string' : type = lookup( t ); break;
					case 'object' :
						if ( 'type' in t ) {
							cname = t.type; delete t.type;
							type  = create( cname, t );
						}
						else type = create( t );
						break;
				}
			}

			this.type = type;
		},
		test         : function()    { // NB we don't need to test the type as it will test itself on instantiation
			return ( is_type( this.type ) || is_schema( this.type ) )
				&& ( is_str( this._id )   || is_num( this._id ) )
				&& this.mixin( 'minmax' );
		},
		value        : function( v ) { return Object.value( v, this.cite ); }
	} );



/*~  src/types.js  ~*/




/*~  src/type/Object.js  ~*/

	define( 'type.Object', {
// class configuration
		alias       : '{} auto mixed object',
		extend      : __lib__.Sanitizer,
// public properties
		contingency : {
			get     : function()    { return is_fun( this.fallback ) ? this.fallback() : this.fallback; },
			set     : function( v ) {
				error( 'warning', {
					instance  : this,
					message   : this.constructor[__classname__] + ': Over-writing `contingency` property is not allowed, please use the `fallback` property instead.'
				} );
				return v;
			}
		},
		fallback    : null,
// public methods
		coerce      : function( v ) {
			return this.valid( v = this.value( v ) ) ? v : this.contingency;
		},
		stringify   : function( v ) {
			return JSON.stringify( this.coerce( v ) );
		},
		valid       : function( v ) {
			return this.validType( v );
		},
// internal methods
		test        : function()    {
			return this.valid( this.contingency );
		},
		validType   : function( v ) {
			return v !== UNDEF;
		},
		value       : function( v ) {
			return v === UNDEF ? this.contingency : v;
		}
	} );



/*~  src/type/Boolean.js  ~*/

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



/*~  src/type/Number.js  ~*/

	define( 'type.Number', {
// class configuration
		alias     : 'num number',
		extend    : __lib__.type.Object,
// public properties
		fallback  : 0,
		max       : Number.POSITIVE_INFINITY,
		min       : Number.NEGATIVE_INFINITY,
		precision : __lib__.DECIMAL_PRECISION,
// public methods
		coerce    : function( v ) {
			v = this.value( v );

			if ( v > this.max ) v = this.max;
			if ( v < this.min ) v = this.min;

			return this.valid( v, true ) ? int_undo( v, this.precision ) : this.contingency;
		},
		valid     : function( v, nocast ) {
			if ( !is_num( v ) ) return false;

			var i = nocast === true ? v : int_from( v, this.precision );

			return this.parent( arguments )
				&& i <= this.max
				&& i >= this.min
				&& ( nocast === true || int_undo( i, this.precision ) === v );
		},
// internal methods
		init      : function() {
			this.parent();

			if ( !is_num( this.precision ) )
				this.precision = __lib__.DECIMAL_PRECISION;

			this.precision = Math.abs( Math.round( this.precision ) );

			switch ( util.ntype( this.fallback ) ) {
				case 'function' : break;
				default         : this.fallback = int_undo( this.value( this.fallback ), this.precision );
			}

			if ( this.max !== Number.POSITIVE_INFINITY )
				this.max = this.value( this.max );
			if ( this.min !== Number.NEGATIVE_INFINITY )
				this.min = this.value( this.min );
		},
		test      : function() {
			return this.valid( this.max, true )
				&& this.valid( this.min, true )
				&& is_int( this.precision )
				&& this.precision <= __lib__.DECIMAL_PRECISION
				&& Math.abs( this.precision ) === this.precision
				&& this.parent();
		},
		validType : is_num,
		value     : function( v ) {
			return int_from( v, this.precision );
		}
	} );



/*~  src/type/Integer.js  ~*/

	define( 'type.Integer', {
// class configuration
		alias     : 'int integer',
		extend    : __lib__.type.Number,
// public properties
		precision : 0,
// public methods
		valid     : function( v ) {
			return this.parent( v, true ) && Math.floor( v ) === v;
		},
// internal methods
		init      : function()    {
			var max = this.max, min = this.min;

			this.precision = 0;

			this.parent( arguments );

	// since we want our Types to be instantiated with as much correctness as possible,
	// we don't want to cast our max/min as Integers
			if ( max !== Number.POSITIVE_INFINITY )
				this.max = max;
			if ( min !== Number.NEGATIVE_INFINITY )
				this.min = min;

		},
		value     : function( v ) {
			return Math.round( this.parent( arguments ) );
		}
	} );



/*~  src/type/Array.js  ~*/

	define( 'type.Array', {
// class configuration
		alias     : '[] array',
		extend    : __lib__.type.Object,
// public properties
		max       : __lib__.MAX_ARRAY_LENGTH,
		min       : 0,
// public methods
		coerce    : function( v, novalidate ) {
			v = this.prune( this.value( v ) );

			return novalidate === true || this.valid( v ) ? v : this.contingency;
		},
		valid     : function( v ) {
			return this.parent( arguments )
				&& v.length <= this.max
				&& v.length >= this.min;
		},
// internal methods
		fallback  : function()    { return []; },
		init      : function()    {
			this.parent();

			this.max = this.max >>> 0;
			this.min = this.min >>> 0;
		},
		prune     : function( v ) {
			if ( v.length > this.max ) // if the length of the coerced Array is greater than the max
				v.length = this.max;   // length allowed, we can simply crop it down before validating.

			if ( v.length < this.min ) {
				var extra = this.contingency.slice( 0, this.min - v.length );
				v.push.apply( v, extra );
			}

			return v;
		},
		test      : function()    {
			return is_int( this.max )
				&& is_int( this.min )
				&& this.max <= __lib__.MAX_ARRAY_LENGTH
				&& this.min >= 0 // we can't have negative Array lengths silly — nb. "silly" refers to YOU, not me. ;^)
				&& this.max >= this.min
				&& this.parent();
		},
		validType : is_arr,
		value     : function( v ) {
			return this.validType( v ) ? v : Array.coerce( v );
		}
	} );



/*~  src/type/Collection.js  ~*/

	define( 'type.Collection', {
// class configuration
		alias      : 'collection',
		extend     : __lib__.type.Array,
// public properties
		itemType   : null,
// public methods
		coerce     : function( v ) {
			v = this.parent( v, true );

			var i = -1, l = v.length;
			while ( ++i < l ) v[i] = this.coerceItem( v[i] );

			return this.valid( v ) ? v : this.contingency;
		},
		valid      : function( v ) {
			return this.parent( arguments ) && v.every( this.validItem, this );
		},
// internal methods
		coerceItem : function( v ) {
			return this.itemType.coerce( v );
		},
		init       : function()    {
			this.parent();

			var item_type = this.itemType;

			switch ( util.ntype( item_type ) ) {
				case 'string'   : item_type = lookup( item_type ); break;
				case 'object'   :
					if ( !( item_type instanceof __lib__.Sanitizer ) )
						item_type = create( item_type );
					break;
				default         : item_type = null;
			}

	// we don't want this to be changed willy-nilly so make it read-only
			util.def( this, 'itemType', { value : item_type }, 'e', true );
		},
		test       : function()    {
			return this.itemType instanceof __lib__.Sanitizer && this.parent();
		},
		validItem  : function( v ) {
			return this.itemType.valid( v );
		}
	} );



/*~  src/type/String.js  ~*/

	define( 'type.String', {
// class configuration
		alias     : 'str string',
		extend    : __lib__.type.Array,
// public properties
		fallback  : '',
		flags     : null,
		pattern   : null,
		trim      : true,
// public methods
		valid     : function( v ) {
			return this.parent( arguments ) && ( ( v.length === 0 && this.min === 0 ) || this.validStr( v ) );
		},
// internal methods
		init      : function()    {
			this.parent();

			if ( is_str( this.pattern ) )
				this.pattern = new RegExp( this.pattern, is_str( this.flags ) ? this.flags : '' );

			if ( is_re( this.pattern ) )
				this.validStr = test_str;
			else
				this.pattern = null;
		},
		prune     : function( v ) {
			if ( v.length > this.max )
				v = v.substring( 0, this.max );

			return v;
		},
		validStr  : return_true,
		validType : is_str,
		value     : function( v ) {
			v = is_str( v ) ? v : String( v );

			v = this.trim === false ? v : v.trim();

			return v;
		}
	} );



/*~  src/type/Enum.js  ~*/

	define( 'type.Enum', {
// class configuration
		alias    : 'enum',
		extend   : __lib__.type.Object,
// public properties
		list     : null,
		inverted : false,
// public methods
		valid    : function( v ) {
			var in_list = !!~this.list.indexOf( v );

			return this.parent( arguments ) && ( this.inverted === true ? !in_list : in_list );
		},
// internal methods
		fallback : function()    { return this.list[0]; },
		init     : function()    {
			this.parent();

			if ( is_str( this.list ) )
				this.list = this.list.split( ' ' );
		},
		test     : function()    {
			return is_arr( this.list ) && this.parent();
		}
	} );



/*~  src/type/Date.js  ~*/

	define( 'type.Date', {
// class configuration
		alias     : 'date',
		extend    : __lib__.type.Object,
// public properties
		format    : api.date.default_format,
		max       :  3250368e7,   // 3000-01-01T00:00:00.000Z
		min       : -621672192e5, // 0000-01-01T00:00:00.000Z
// public methods
		coerce    : function( v ) { // todo: make this mo' efficient
			v = this.parent( arguments );

			if ( +v > +this.max ) return new Date( +this.max );
			if ( +v < +this.min ) return new Date( +this.min );

			return v;
		},
		stringify   : function( v ) {
			return api.date.format( this.coerce( v ), this.format );
		},
		valid     : function( v ) {
			return this.parent( arguments ) && api.date.between( v, this.min, this.max );
		},
// internal methods
		fallback  : function() { return new Date; },
		init      : function() {
			this.parent();

			if ( is_str( this.fallback ) )
				this.fallback = this.value( this.fallback );

			this.max = this.value( this.max );
			this.min = this.value( this.min );
		},
		test      : function() {
			return this.valid( this.max )
				&& this.valid( this.min )
				&& this.parent();
		},
		validType : is_date,
		value     : function( v ) {
			switch ( util.ntype( v ) ) {
				case 'date'   : return v;
				case 'number' : return new Date( v ); // assume unix timestamp
				case 'string' : return api.date.coerce( v, this.format );
			}

			return this.contingency;
		}
	} );






/*~  src/exceptions.js  ~*/




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






// at this point we don't know if m8 is available or not, and as such do not know what environment we are in.
// so, we check and do what is required.
}( ( typeof id8 != 'undefined' ? id8 : typeof require != 'undefined' ? require( 'id8' ) : null ), 'expurg8' );
