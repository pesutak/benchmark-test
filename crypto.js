
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

function stringifyJSON3(obj) {
	const { stringify } = JSON
	if('signature' in obj) 
		delete obj.signature

	const sortKeys = (obj) => {
		return Object.keys(obj).sort().reduce((acc,key) => {
			Array.isArray(obj[key]) 
				? acc[key] = obj[key].map(stringifyJSON3) 
				: acc[key] = (typeof obj[key] === 'object') 
					? acc[key] = sortKeys(obj[key])
					: obj[key];
			return acc;
		},{})
	}

	return stringify(sortKeys(obj))
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

module.exports = {
	stringifyJSON,
	stringifyJSON2,
	stringifyJSON3,
	flattenJSONtoSign
}
