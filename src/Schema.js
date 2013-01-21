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
			afterdefine       : function( Class ) {
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
						{ value : is_obj( Super[__properties__] ) ? util.merge( util.merge( Super[__properties__] ), props ) : props },
						 'r',
						  true );
			},
	// this handles allowing Schema's to have their `properties` rejigged as well as ensuring
	// any `properties` defined when the Schema was created are added to the the instance
	// without risking any of the pitfalls created from adding non-primitives to Function prototypes
			beforeinstance    : function( Class, instance, args ) {
				var config = is_obj( args[0] ) ? args[0] : args[0] = { properties : util.obj() },
					props  = config.properties;

				if ( is_arr( props ) )
					props = props.reduce( to_property_map.bind( Class ), util.obj() );

				if ( !is_obj( props ) )
					props = util.obj();

				if ( is_obj( Class[__properties__] ) )
					props = util.merge( util.merge( Class[__properties__] ), props );

				config.properties = Object.reduce( props, to_property_array.bind( this ), [] );
			},
// class configuration
			extend            : __lib__.Sanitizer,
// public properties
			attribute         : null,
			cast              : null,
			properties        : null,
			sanitizeProperty_ : null, // Array#reduce doesn't supply a context param, so we need to set this in `init`
// public methods
			coerce            : function( v ) {
				var SM          = STRICT_MODE,
					strict      = this.strict,
					val         = this.sanitize( this.accumulator( v ) ).value;

				strict === SM.FALLBACK || this.valid( val ) || error( strict === SM.ERROR ? 'error' : 'warning', {
					data     : v,
					value    : val,
					instance : this,
					message  : this.constructor[__classname__] + ': Invalid coercion.'
				} );

				return val;
			},
			sanitize          : function ( accumulator ) {
				return this.properties.reduce( this.sanitizeProperty_, accumulator );
			},
			valid             : function( v ) {
				return this.properties.every( this.validProperty.bind( this, v ) );
			},
// internal methods
			accumulator       : function( v ) {
				return new Accumulator( this, v, this.value( v ) )
			},
			init              : function()    {
	// `this.properties` should always be an Array because of the `beforeinstance` catch all
	// it should be technically impossible for it to not be an Array; the only way for it to not be would be to
	// explicitly call expurg8.Schema.Property.prototype.init without creating an instance, in which case: WHY!!??
	// `this.attribute` is a map of the `this.properties` Array using the Schema.Property `id` as the key.
				this.attribute  = util.obj();
				this.properties = this.properties.map( this.initProperty, this );

				util.def( this, 'sanitizeProperty_', this.sanitizeProperty.bind( this ), 'w', true );

				this.parent();
			},
			initProperty      : function( prop ) {
				var property = is_prop( prop ) ? prop : create( 'property', util.copy( prop, { schema : this } ) );
				return this.attribute[property.id] = property;
			},
			sanitizeProperty  : function( accumulator, property ) {
				return property.sanitize( accumulator );
			},
	// NB we don't need to test each property as they will test themselves on instantiation
			test              : function()    {
				return is_arr( this.properties ) && !!this.properties.length && this.properties.every( is_prop );
			},
			validProperty     : function( v, property ) {
				return property.valid( v );
			},
			value             : function( v ) {
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
