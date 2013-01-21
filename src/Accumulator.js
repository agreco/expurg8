	function Accumulator( schema, data, value ) {
		this.schema = schema;
		this.data   = data;
		this.value  = value || ( is_arr( data ) ? [] : util.obj() );
	}

	Accumulator.prototype = {
		constructor : Accumulator,
		data        : null,
		schema      : null,
		value       : null,
		valueOf     : function() { return this.value; }
	};
