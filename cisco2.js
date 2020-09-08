const { priv_key, pub_key, small, big, pub_key2 } = require('./data');
var jose = require('node-jose');
var crypto = require('crypto');

const { stringifyJSON3, stringifyJSON2, stringifyJSON } = require('./crypto');

const SIGNATURE_ALGORITHM = 'sha256';
const SIGNATURE_ENCODING = 'base64';

var payload = {"a":1 } //JSON.stringify(small);


function createSignatureJOSE( payload, privateKey )
{		
		var ret;
		let cb = (res) => {
			ret = res
		}

		(async () => {
			const key = await jose.JWK.asKey(privateKey, 'pem');
			const token = await jose.JWS.createSign({alg: 'RS128', format: 'flattened'}, key).update(payload, "utf8").final()
			cb(token); //.signature);
		})();

		require('deasync').loopWhile(() => ret === undefined);
		return ret
}

function createSignatureJOSEAsync( payload, privateKey ){
	return new Promise(resolve => resolve(createSignature(payload, privateKey)))
}

function verifySignatureJOSE(payload, signature, publicKey){
	var ret;
	const cb = (res) => { ret = res; }
	(async ()=>{
		const key = await jose.JWK.asKey(publicKey, 'pem');
		//console.log(key);
		const verify = await jose.JWS.createVerify(key).verify(payload);
		cb(verify);
	})()
	require('deasync').loopWhile(() => ret === undefined);
	return ret
}

function createSignature( payload, privateKey, flattenAlg )
{
	const signer = crypto.createSign( SIGNATURE_ALGORITHM );

	signer.update( flattenAlg ( payload ) );
	signer.end();

	const signature = signer.sign( privateKey );

	return signature.toString( SIGNATURE_ENCODING );
}

function createSignatureAsync(payload, privateKey, flattenAlg){
	return new Promise(resolve => resolve(createSignature(payload, privateKey, flattenAlg)))
}

function verifyJSON( signedJson, publicKey, flattenAlg )
{
	if(!('signature' in signedJson))
	{
		throw new Error( 'Input object is missing "signature" key' );
	}

	const signature = signedJson.signature;

	const stringified = flattenAlg( signedJson );

	const verifier = crypto.createVerify( SIGNATURE_ALGORITHM );

	verifier.update( stringified );
	verifier.end();

	const verified = verifier.verify( publicKey, signature, SIGNATURE_ENCODING );

	return verified;
}



//const signer = crypto.createSign( SIGNATURE_ALGORITHM );
//signer.update( stringifyJSON ( payload ) );
//signer.end();
//const signature = signer.sign( priv_key ).toString( SIGNATURE_ENCODING );
//console.log(sign)

//createSignatureAsync(payload, priv_key, stringifyJSON2)
//	.then(sign => {
//		console.log(sign)
//	})


//return 0;

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite

//suite.add('warm-up', async () => { });

suite.add('sign-xclbr', () => {
	const signer = crypto.createSign( SIGNATURE_ALGORITHM );
	signer.update( stringifyJSON ( payload ) );
	signer.end();
	const signature = signer.sign( priv_key ).toString( SIGNATURE_ENCODING );
	//createSignature(JSON.stringify(payload),priv_key);
});

suite.add('sign-xclbr2', () => {
	const signer = crypto.createSign( SIGNATURE_ALGORITHM );
	signer.update( stringifyJSON2 ( payload ) );
	signer.end();
	const signature = signer.sign( priv_key ).toString( SIGNATURE_ENCODING );
});

suite.add('sign-xclbr2-async', async () => {
	const signature = await createSignatureAsync(payload, priv_key, stringifyJSON2)
});

suite.add('sign-jose-sync',  () => {
	createSignatureJOSE(JSON.stringify(payload),priv_key)
});


suite.add('sign-jose-async', async () => {
	try{	
		const signature = await createSignatureJOSEAsync(payload, priv_key)
	} catch(err){
		
	}
})

suite.add('sign-jose-async2', async () => {
	
	try {
		const key = await jose.JWK.asKey(priv_key, 'pem');
		const res = await jose.JWS.createSign({alg: 'RS256', format: 'flattened'}, key).update(payload, "utf8").final()
		const signature = res.signature
	} catch(err){
	//	//suite.abort()
	}
});

suite.on('cycle', function(event) {
	console.log(String(event.target));
})

suite.on('complete', function() {
	console.log('Fastest is ' + this.filter('fastest').map('name'));
})

// run async
suite.run({ 'async': true });
