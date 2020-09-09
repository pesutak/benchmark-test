
function stringifyJSON2(obj) {
	if('signature' in obj) 
		delete obj.signature
	return JSON.stringify (
		Object.keys(obj).sort().reduce((acc,key) => {
			acc[key] = (typeof obj[key] === 'object') 
				? `${JSON.stringify(obj[key])}` : `${obj[key]}`;
			return acc;
		},{})
	)
}

function stringifyJSON3(obj)
{
	if('signature' in obj)
	{
		delete obj.signature;
	}

	const stringify = ( obj ) =>
	{
		const sortKeys = ( obj ) =>
		{
			const initialValue = {};
			const keys = Object.keys(obj).sort();

			return keys.reduce( (acc,key) =>
			{
				if ( Array.isArray( obj[key]) )
				{
					acc[key] = obj[key].map(x => stringify( x ) );
				}
				else
				{
					acc[key] = ( typeof obj[key] === 'object' ) 
						? acc[key] = sortKeys( obj[key] )
						: obj[key];
				}

				return acc;

			}, initialValue) ;
		}

		return JSON.stringify( sortKeys( obj ) );
	}

	return stringify( obj );
}


function stringifyJSON( json ) 
{
	let result = '';

	const entries = Object.entries( json ).sort();
	if ( entries.length > 0 )
	{
		for ( const [ key, value ] of entries )
		{
			if ( key === 'signature' )
			{
				continue;
			}

			result += ( result.length === 0 ? '' : ',' ) + `"${key}":`;

			if ( value === null )
			{
				result += 'null';
			}
			else if ( typeof value === 'object' )
			{
				result += JSON.stringify( JSON.stringify( value ) );
			}
			else
			{
				result += `"${value.toString()}"`;
			}
		}
	}

	result = `{${result}}`;

	return result;
}

function flattenJSONtoSign( data )
{
	var flat = '', keys = Object.keys(data).sort();

	for( let key of keys )
	{
		if( key == 'signature' ){ continue; }
		flat += ( flat.length ? ',' : '' ) + JSON.stringify(key) + ':' + ( data[key] === null ? 'null' : JSON.stringify(data[key].toString()) );
	}

	return '{' + flat + '}';
}

var canonicalize = function(object)
{
	if ('signature' in object)
	{
		delete object.signature;
	}

	var buffer = '';
	serialize(object);
	return buffer;

	function serialize(object) {
		if (object === null || typeof object !== 'object') {
			/////////////////////////////////////////////////
			// Primitive data type - Use ES6/JSON          //
			/////////////////////////////////////////////////
			buffer += JSON.stringify(object);

		} else if (Array.isArray(object)) {
			/////////////////////////////////////////////////
			// Array - Maintain element order              //
			/////////////////////////////////////////////////
			buffer += '[';
			let next = false;
			object.forEach((element) => {
				if (next) {
					buffer += ',';
				}
				next = true;
				/////////////////////////////////////////
				// Array element - Recursive expansion //
				/////////////////////////////////////////
				serialize(element);
			});
			buffer += ']';

		} else {
			/////////////////////////////////////////////////
			// Object - Sort properties before serializing //
			/////////////////////////////////////////////////
			buffer += '{';
			let next = false;
			Object.keys(object).sort().forEach((property) => {
				if (next) {
					buffer += ',';
				}
				next = true;
				///////////////////////////////////////////////
				// Property names are strings - Use ES6/JSON //
				///////////////////////////////////////////////
				buffer += JSON.stringify(property);
				buffer += ':';
				//////////////////////////////////////////
				// Property value - Recursive expansion //
				//////////////////////////////////////////
				serialize(object[property]);
			});
			buffer += '}';
		}
	}
};

module.exports =
{
	stringifyJSON,
	stringifyJSON2,
	stringifyJSON3,
	flattenJSONtoSign,
	canonicalize
}
