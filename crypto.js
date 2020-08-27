
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

const data = {
	cart: "CERT HERE",
	signature: "datasignature",
	uid: 42,
	metadata:{
		cpu: 2,
		label: "log.data=123"
	},
	msg: "message here"
}

const data3 = {
	cart: "CERT HERE",
	signature: "datasignature",
	uid: 42,
	msg: "message here",
	name: "small-data"
}


const data_with_cert = {
	private: "-----BEGIN RSA PRIVATE KEY-----\
MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6vUp\
wmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/3j+skZ6UtW+5u09lHNsj6tQ5\
1s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQABAoGAFijko56+qGyN8M0RVyaRAXz++xTqHBLh\
pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX\
3tx4VgMtrQ+WEgCjhoTwo23KMBAuJGSYnRmoBZM3lMfTKevIkAidPExvYCdm5dYq3XToLkkLv5L2\
GukBI4eMZZt4nscy2o12KyYner3VpoeE+Np2q+Z3pvAMd/aNzQ/W9WaI+NRfcxUJrmfPwIGm63il\
AkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF\
L0NDt4SkosjgGwJAFklyR1uZ/wPJjj611cdBcztlPdqoxssQGnh85BzCj/u3WqBpE2vjvyyvyI5k\
X6zk7S0ljKtt2jny2+00VsBerQJBAJGC1Mg5Oydo5NwD6BiROrPxGo2bpTbu/fhrT8ebHkTz2epl\
U9VQQSQzY1oZMVX8i1m5WUTLPz2yLJIBQVdXqhMCQBGoiuSoSjafUhV7i1cEGpb88h5NBYZzWXGZ\
37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=\
-----END RSA PRIVATE KEY-----",
	public: "-----BEGIN PUBLIC KEY-----\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0\
FPqri0cb2JZfXJ/DgYSF6vUpwmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/\
3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQAB\
-----END PUBLIC KEY-----",
	uid: 123456789098,
	name: 'big-data',
	os: 'android',
	signature: '235239579238592387598395862398765872365872635876238576'
}

module.exports = {
	stringifyJSON,
	stringifyJSON2,
	flattenJSONtoSign,
	data, data3, data_with_cert
}
