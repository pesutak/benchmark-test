
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
	flattenJSONtoSign
}
