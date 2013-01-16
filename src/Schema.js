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
					classname : this.constructor[__classname__],
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
