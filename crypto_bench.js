const crypto = require('./crypto')
const data = require('./data')
const utils_js = require("@excalibur-enterprise/utils-js");
const fs = require("fs");


var node_jose = require("node-jose");

const Benchmark = require('benchmark');
const { Console } = require('console');
const suite_small = new Benchmark.Suite
const suite_big = new Benchmark.Suite

const big_data = data.super_big
const small_data = data.small

// async function loadKeys(){

// 	console.log('WHY');

// 	const companyId = 3;
// 	const passphrase = utils_js.Passphrase.createFacade(companyId);
// 	const [certificatePem, privateKeyPem] = await Promise.all([
// 		fsx.readFile("/devel/excalibur-server-v3.5/excalibur-ad-facade-js//config/certificates/certificate.crt"),
// 		fsx.readFile("/devel/excalibur-server-v3.5/excalibur-ad-facade-js//config/certificates/private.key")
// 	]);
	
// 	const publicKey = utils_js.Crypto.createPublicKey(certificatePem);
// 	const privateKey = utils_js.Crypto.createPrivateKey(privateKeyPem, passphrase);

// 	return { publicKey: publicKey, privateKey: privateKey};
// }

function loadKeys(){

	console.log('WHY');

	const companyId = 3;
	const passphrase = utils_js.Passphrase.createFacade(companyId);
	const certificatePem = fs.readFileSync("/devel/excalibur-server-v3.5/excalibur-ad-facade-js//config/certificates/certificate.crt");
	const privateKeyPem	= fs.readFileSync("/devel/excalibur-server-v3.5/excalibur-ad-facade-js//config/certificates/private.key");
	
	const publicKey = utils_js.Crypto.createPublicKey(certificatePem);
	const privateKey = utils_js.Crypto.createPrivateKey(privateKeyPem, passphrase);

	return { publicKey: publicKey, privateKey: privateKey};
}

const keys = loadKeys();
console.log( keys );


async function testOld( data ){
	const result = crypto.createSignatureOld( data, keys.privateKey );
	//console.log( result );
}

async function getKey (){
	const key = await node_jose.JWK.asKey(data.pem, "pem");
	
	//console.log("key", key);
	return key;
	// return key;
}

async function test() {

	const key = await getKey();
	var payload = JSON.stringify( small_data );
    

	// add tests
	suite_small

		.add('small-createSignature', async function () {
			//crypto.createSignature( small_data, getKey() )
			await crypto.createSignature(payload, key)
		})

		.add('small-createSignatureOld', function () {
			crypto.createSignatureOld(small_data, keys.privateKey)
		})

		.on('cycle', function (event) {
			console.log(String(event.target));
		})

		.on('complete', function () {
			console.log('SMALL Fastest is ' + this.filter('fastest').map('name'));
		})

		// run async
		.run({ 'async': false });

	// suite_big

	// .add('big-createSignature', function() {
	// 	crypto.createSignature(big_data, getKey())
	// },)

	// // .add('big-createSignatureOld', function() {
	// // 	crypto.createSignatureOld(big_data, privateKey)
	// // },)

	// .on('cycle', function(event) {
	// 	console.log(String(event.target));
	// })

	// .on('complete', function() {
	// 	console.log('BIG Fastest is ' + this.filter('fastest').map('name'));
	// })

	// // run async
	// .run({ 'async': false });

}

test();

