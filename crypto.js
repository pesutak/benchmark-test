var node_jose = require("node-jose");

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

var canonicalize = function(object) {
  
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

const SIGNATURE_ALGORITHM = 'sha256';
const SIGNATURE_ENCODING = 'base64';


const utils_js = require("@excalibur-enterprise/utils-js");


async function createSignatureOld( jsonData, privateKey ){
	//console.log(jsonData, privateKey);
	return utils_js.Crypto.signJSON(jsonData, privateKey);
}

async function createSignature( payload, key ){
//async function createSignature( jsonData, pem ){

    //var key = await node_jose.JWK.asKey(pem, "pem");

    // const data1 = {"sub": "1234567890",  "name": "Eric D.",  "role": "admin","iat": 1516239022};
    // const data2 = {"name": "Eric D.", "sub": "1234567890",  "role": "admin","iat": 1516239022};

    //var payload = JSON.stringify( jsonData );
    //var token = await node_jose.JWS.createSign({alg: "RS256", format: 'flattened'}, key).update(payload, "utf8").final();
	var token = await node_jose.JWS.createSign({alg: "RS256"}, key).update(payload, "utf8").final();
	//console.log("token", token);
	
	//process.exit(1);
	
	return token;

    // var payload2 =JSON.stringify({"role": "admin","iat": 1516239022, "sub": "1234567890",  "name": "Eric D." });
    // var token2 = await node_jose.JWS.createSign({alg: "RS256", format: 'flattened'}, key).update(payload2, "utf8").final();
    //console.log(token2);

    // node_jose.JWS.createVerify(key)
    // .verify(token)
    // .then(function(result) {
    //       console.log("verify", result);
    //       var output = node_jose.util.base64url.encode(result.payload);
    //       console.log("output", output);

    //       return result;
    // }); 
}

async function verify (jsonData ){



}

module.exports = {
	stringifyJSON,
	stringifyJSON2,
	flattenJSONtoSign,
	canonicalize,
	createSignature,
	createSignatureOld
}
