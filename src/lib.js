	function create( classname, config ) {
		if ( is_obj( classname ) && !config ) {
			config    = classname;
			classname = config.classname; delete config.classname;
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
				err = '{0}No Class found with name: {1}.';
		}
		else
			err = '{0}Invalid Class name. Expected the name of an existing {Name}.Sanitizer Class instead received: {1}';

		!err || error( {
			classname : classname, configuration : config, message : util.format( err, '{Name}.create: ', classname )
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
