const { priv_key, pub_key, small, big, pub_key2 } = require('./data');
var jose = require('node-jose');
var crypto = require('crypto');

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
			//console.log(key.toPEM())
			const token = await jose.JWS.createSign({alg: 'RS128', format: 'flattened'}, key).update(payload, "utf8").final();

			cb(token); //.signature);
		})();

		require('deasync').loopWhile(() => ret === undefined);
		return ret
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


/*
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite

suite.add('warm-up', async () => {

});

suite.add('sign-xclbr', () => {
	createSignature(JSON.stringify(payload),priv_key);
});

suite.add('sign-jose', () => {
	createSignatureJSON(JSON.stringify(payload),priv_key)
});

suite.on('cycle', function(event) {
	console.log(String(event.target));
})

suite.on('complete', function() {
	console.log('SMALL Fastest is ' + this.filter('fastest').map('name'));
})

// run async
suite.run({ 'async': true });
*/

const { stringifyJSON3, stringifyJSON } = require('./crypto');
const Stopwatch  = require('./stopwatch');
const data = require('./data');
const st = new Stopwatch();

const perc = (v1, v2) => {
	return (( v2-v1 ) / (( v1+v2 ) / 2)) * 100
}

function main() {

	const ITER = 1000;
	const pl = big;
	const times = [0, 0, 0];
	

	for(i=0; i < ITER; i++) {
		pl.a = i;
		const res = createSignature(pl, priv_key, stringifyJSON3)
		pl.signature = res;
		const ver = verifyJSON(pl, pub_key2, stringifyJSON3)
		if(!ver){
			throw 'invalid signature xclbr';
		}
	}
	times[0] = st.diff();
	console.log(`xclbr-f2: ${st.diff()}ms ops: ${1000/(st.diff()/1000)}` )
	st.reset()

	for(i=0; i < ITER; i++) {
		pl.a = i;
		const res = createSignature(pl, priv_key, stringifyJSON)
		pl.signature = res;
		const ver = verifyJSON(pl, pub_key2, stringifyJSON)
		if(!ver){
			throw 'invalid signature xclbr';
		}
	}
	times[1] = st.diff();
	console.log(`xclbr: ${st.diff()}ms ops: ${1000/(st.diff()/1000)}` )
	st.reset()


	for(i=0; i < ITER; i++){
		pl.a = i;
		const res = createSignatureJOSE(JSON.stringify( pl ), priv_key)
		const ver = verifySignatureJOSE(res, null, pub_key)
		if(res.signature !== jose.util.base64url.encode(ver.signature)){
			throw 'invalid signature jose';
		}
	}

	times[2] = st.diff();
	console.log(`jose: ${st.diff()}ms ops: ${1000/(st.diff()/1000)}` )

	console.log(`xclbr is fastest by:\t${ perc(times[0], times[2]) }%`)
	console.log(`xclbr-f2 is fastest by:\t${ perc(times[1], times[2]) }%`)
	st.reset();

	console.log('DONE!')

}



console.log(perc(50,100))
//main();

// const a = createSignatureJOSE(payload, priv_key);
// console.log(a.signature);
// const b = verifySignatureJOSE(a, null, pub_key);
// console.log(jose.util.base64url.encode(b.signature))

//const sign = createSignature(stringifyJSON(payload), priv_key)
//payload.signature = sign;
//console.log(pub_key2)
//const ver = verifyJSON(payload, pub_key2, stringifyJSON)
//console.log(ver)