const { priv_key, pub_key, small, big, super_big, pub_key2 } = require('./data');

const Benchmark = require('benchmark');
const jose = require('node-jose');
const crypto = require('crypto');
const stringify = require('fast-json-stable-stringify');
const jsonReporter = require('benchmark-json-reporter');

const { stringifyJSON3, stringifyJSON2, stringifyJSON, canonicalize } = require('./crypto');

const SIGNATURE_ALGORITHM = 'sha256';
const SIGNATURE_ENCODING = 'base64';

var obj = { b: 3, c: 2, a: 1 }; //JSON.stringify(small);

class JOSE
{
	static async signJSON(payload, privateKey)
	{
		const key = await jose.JWK.asKey(privateKey, 'pem');
	
		const options =
		{
			alg: 'RS256',
			format: 'compact'
		};
	
		const token = await jose.JWS.createSign(options, key)
			.update(payload, "utf8")
			.final();

		return token;
	}

	static async verifyJSON(payload, signature, publicKey)
	{
		const key = await jose.JWK.asKey(publicKey, 'pem');
		const verifier = jose.JWS.createVerify(key);
		const result = await verifier.verify(payload);

		const success = result.signature === signature;

		return success;
	}
};

class Excalibur
{
	static stringifyJSON(obj)
	{
		if('signature' in obj)
		{
			delete obj.signature;
		}

		const strfy = ( obj ) =>
		{
			const sortKeys = ( obj ) =>
			{
				const initialValue = {};
				const keys = Object.keys(obj).sort();

				return keys.reduce( (acc,key) =>
				{
					if ( Array.isArray( obj[key]) )
					{
						acc[key] = obj[key].map(x => strfy( x ) );
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

		return strfy( obj );
	}

	static createSignature(stringified, privateKey) {
		const signer = crypto.createSign(SIGNATURE_ALGORITHM);
		signer.update(stringified);
		signer.end();
		const signature = signer.sign(privateKey);
		return signature.toString(SIGNATURE_ENCODING);
	}

	static createSignatureAsync(stringified, privateKey) {
		return new Promise((resolve, reject) => {
			const signer = crypto.createSign(SIGNATURE_ALGORITHM);
			signer.write(stringified, (error) => {
				if (error) {
					reject(error);
				}
				else {
					signer.end();
					const signature = signer.sign(privateKey);
					resolve(signature.toString(SIGNATURE_ENCODING));
				}
			})
		});
	}

	static signJSON(json, privateKey, canonizer = Excalibur.stringifyJSON) {
		const canonized = canonizer(json);
		const signature = Excalibur.createSignature(canonized, privateKey);
		const result = {
			...json,
			signature
		};
		return result;
	}

	static async signJSONAsync(json, privateKey, canonizer = Excalibur.stringifyJSON) {
		const canonized = canonizer(json);
		const signature = await Excalibur.createSignature(canonized, privateKey);
		const result = {
			...json,
			signature
		};
		return result;
	}

	static verifyJSON(signedJson, publicKey, canonizer = Excalibur.stringifyJSON) {
		const signature = signedJson.signature;
		const stringified = canonizer(signedJson);
		const verifier = crypto.createVerify(SIGNATURE_ALGORITHM);
		verifier.update(stringified);
		verifier.end();
		const verified = verifier.verify(publicKey, signature, SIGNATURE_ENCODING);
		return verified;
	}

	static createPrivateKey(pem, passphrase) {
		const privateKey = crypto.createPrivateKey({
			key: pem,
			passphrase,
			format: 'pem'
		});
		return privateKey;
	}

	static createPublicKey(pem) {
		const publicKey = crypto.createPublicKey({
			key: pem,
			format: 'pem'
		});
		return publicKey;
	}
}

const privateKeyPem =
`-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAuHuxq5Q5vpNVX2DMGd4OqQYkS6Nxtb+p/aAtjghF+5j11dYs
vPNRQ6qP6MU432tebWNjsejNb6c2rvlXI8EnlK2FPymFYzBIeZljaQzpSIN51mkd
b8UjTjLRodOC3Ldr1fkGyhCgwwkmO46RyLzFy3theCa1VNEzDcwVKHwciSZGNBAv
zomWBQj5Lb+pVzMx5q8BXANfQqbXc1324Jxsq4/b5d2Vc64KFlvoH8CK/ybS3YVi
zI4sPpQ4ahuw0ymeM6HjJugy5OXh/AX3H4Pcq/NVK66zwdGZL+GU1XyLIm6LQoLr
hEWihz03Qi3S4mzfnbmHCdvtGJtZAvFPLK9hhQIDAQABAoIBAQCCAiGmYfIDvL64
VXXgcN3x/bMMXuWeiLCaXQxdgLUY5qWwiZvDmNFXF1cNWheHU5obCqTSVtaX7cYa
rvra5p8nJtW1OmSXDwq0LwWgnYm1IXp2QGOPReVokWWsXmtlchmblEBVnDw+1i7M
X9+bEHVvvcZlrxmw6TDKc10hx70wZMcdnoX+ndq9pm+2PreYfR8Awd77L0Wnyaic
fO7NTS7Lfaxf2hNzrRLvlVJsWuOOCxwMc3W8IbtKnaKVEkHypqACmfvvKBHGKHwL
Y7Me6Rax2uydFbg3/7/6i000n9N8LHIilgzZbaA2fKWGNo6oGbv9YdzKYtgIwKor
5kni0fmhAoGBAOJDOSCn8cApffUwHbDw8bZPxN4MnJ/TAkeID6Hg58Jf44gZQJsE
5tn5ZTrRfUvQmy4feVTNT0C0m1a3xcRr/xwEBETyDmH/fp4DGf4NosjkmanS1uLz
ekUiigO+5M/p2EMaShKhnSDXpIRg7S4igp3ph+sZXikyZBMKGMvqG/jtAoGBANC6
xVXFuzgs2eldQy0UCJqlroDHuzeiVMUCLE7VdSdidSBHyRv9sDs2Q/7FmaJAOrGy
2PnAQkmvAUAWtp6i4eGn9UsDDDIvLDidl6gbQyDVJhK7z2ODHkZueBxTsp6UrAqr
VVi1R/1XqKPgP7DeT2/MVu8qQZEVf6zpgYSIye/5AoGBANG/46ukRPYRANVVP5ES
K+EIXcZDBscaw5gwR92XMwH8Bl/amQucJa2YBwHZxj+MKO8++illEr03MHHZdxq5
ywrbpmGLy02JnoU49tWPKoL1eIX4EIDfmU+Rz0PdqRwc+gBq1JQlAha6Eacue3Ez
SMa/AOMu5x1lu2PzDj2qzzeZAoGAXbnAKoejTdI192f9Zhx80JRdC06kbpLh5aTY
KH4JISpA1cHmOD9uBuiTF6+7EPQuZuScMWl3WobO1OxeDFWvgBhfONOhgldUUAfT
tZSoS/HqKrdSpKiXy6CHJpEev76akh/lLvQX41adTxi/ALiSiu0CjFo5HuC8d/RS
SCT0KGECgYEAp2QoPtbddI3Qm/CFWgjxt7fJmoCdqKn823z5zL2+KeX/CSQ+sxiL
2j+1QtLhLtTI8j7Am/hCEaB2Ko5cUHPR/2Kr3c6uJj+ocfJFkUy0oW7Mb8UcmVp4
1ZfBCMnIfu1U53aQHK/iYZCGhhXfg4m0f5fS8OubEMV3eZuAAigO0Vc=
-----END RSA PRIVATE KEY-----`;

const publicKeyPem = 
`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuHuxq5Q5vpNVX2DMGd4O
qQYkS6Nxtb+p/aAtjghF+5j11dYsvPNRQ6qP6MU432tebWNjsejNb6c2rvlXI8En
lK2FPymFYzBIeZljaQzpSIN51mkdb8UjTjLRodOC3Ldr1fkGyhCgwwkmO46RyLzF
y3theCa1VNEzDcwVKHwciSZGNBAvzomWBQj5Lb+pVzMx5q8BXANfQqbXc1324Jxs
q4/b5d2Vc64KFlvoH8CK/ybS3YVizI4sPpQ4ahuw0ymeM6HjJugy5OXh/AX3H4Pc
q/NVK66zwdGZL+GU1XyLIm6LQoLrhEWihz03Qi3S4mzfnbmHCdvtGJtZAvFPLK9h
hQIDAQAB
-----END PUBLIC KEY-----`;

function validateRSAKeyPair( publicKeyPem, privateKeyPem )
{
	const c = require( 'crypto' );

	const data = 'Hello world!';

	const encrypted = c.publicEncrypt( publicKeyPem, Buffer.from( data ) );
	const decrypted = c.privateDecrypt( privateKeyPem, encrypted ).toString('utf8');

	if ( data !== decrypted )
	{
		throw new Error( 'Invalid RSA key pair provided' );
	}
}

async function test()
{
	const payload = JSON.stringify( obj );

	const token = await JOSE.signJSON( payload, privateKeyPem );

	console.log( token );

	const key = await jose.JWK.asKey(publicKeyPem, 'pem');
	const verifier = jose.JWS.createVerify(key);
	const result = await verifier.verify(token);

	console.log( `Received payload: ${result.payload.toString('utf8')}` );
	// const verified = await JOSE.verifyJSON( token, signature, publicKeyPem );

	// console.log( verified );
}

async function benchmark()
{
	const preloadedPrivateKey = await jose.JWK.asKey(privateKeyPem, 'pem');
	const preloadedPublicKey = await jose.JWK.asKey(publicKeyPem, 'pem');

	const excPreloadedPrivateKey = Excalibur.createPrivateKey(privateKeyPem);
	const excPreloadedPublicKey = Excalibur.createPublicKey(publicKeyPem);

	const dataSets = new Map([
		//[ 'small', small ],
		[ 'common', big ],
		//[ 'large', super_big ]
	]);

	for ( const [ setName, dataSet ] of dataSets )
	{
		const payload = JSON.stringify( dataSet );
	
		const options =
		{
			alg: 'RS256',
			format: 'compact' // Output token as string
		};

		const pregeneratedToken = await jose.JWS.createSign(options, preloadedPrivateKey)
			.update(payload, "utf8")
			.final();

		const presigned = Excalibur.signJSON( dataSet, privateKeyPem );
		const success = Excalibur.verifyJSON( presigned, publicKeyPem );
			
		const results = [
			canonicalize( dataSet ),
			stringifyJSON3( dataSet )
		];

		const same = results.every((value, index, array) =>
		{
			return value === array[0];
		});

		if ( !same )
		{
			results.forEach((value) => console.log( value ));

			console.log( `'${setName}' set not giving the same results!` );
		}

		new Benchmark.Suite( `Canonicalize '${setName}'` )
			.add('canonicalize', () =>
			{
				canonicalize( dataSet );
			})
			.add('stringifyJSON3', () =>
			{
				stringifyJSON3( dataSet );
			})
			.on('cycle', function (event)
			{
				console.log( `${event.currentTarget.name}: ${String(event.target)}` );
			})
			.on('complete', function ()
			{
				console.log(`Fastest is ${this.filter('fastest').map('name')}`);
			})
			//.run();

		new Benchmark.Suite( `Stringify '${setName}'` )
			.add('canonicalize', () =>
			{
				canonicalize( dataSet );
			})
			.add('stringifyJSON3', () =>
			{
				Excalibur.stringifyJSON( dataSet );
			})
			.add('JSON.stringify', () =>
			{
				JSON.stringify( dataSet );
			})
			.add('Fast stringify', () =>
			{
				stringify( dataSet );
			})
			.on('cycle', function (event)
			{
				console.log( `${event.currentTarget.name}: ${String(event.target)}` );
			})
			.on('complete', function ()
			{
				console.log(`Fastest is ${this.filter('fastest').map('name')}`);
			})
			//.run();

		new Benchmark.Suite( `Sign '${setName}'` )
			.add('JOSE Sign', {
				defer: true,
				fn: async ( deferred ) =>
				{
					const key = await jose.JWK.asKey(privateKeyPem, 'pem');
				
					const token = await jose.JWS.createSign(options, key)
						.update(JSON.stringify(dataSet), "utf8")
						.final();
	
					deferred.resolve();
				}
			})
			.add('JOSE Sign with preloaded key', {
				defer: true,
				fn: async ( deferred ) =>
				{
					const token = await jose.JWS.createSign(options, preloadedPrivateKey)
						.update(JSON.stringify(dataSet), "utf8")
						.final();
	
					deferred.resolve();
				}
			})
			.add('Multiple JOSE Sign with preloaded key', {
				defer: true,
				fn: async ( deferred ) =>
				{
					const tasks = [];

					for (let i = 0; i < 100; ++i)
					{
						const signer = jose.JWS.createSign(options, preloadedPrivateKey);

						tasks.push( signer
							.update(JSON.stringify(dataSet), "utf8")
							.final() );
					}

					await Promise.all( tasks );
	
					deferred.resolve();
				}
			})
			.add('Excalibur Sign', ()=>
			{
				JSON.stringify(Excalibur.signJSON(dataSet, privateKeyPem, JSON.stringify));
			})
			.add('Excalibur Sign Async', {
				defer: true,
				fn: async (deffered) =>
				{
					JSON.stringify( await Excalibur.signJSONAsync(dataSet, privateKeyPem, JSON.stringify));

					deffered.resolve();
				}
			})
			.add('Excalibur Sign with preloaded key', () =>
			{
				JSON.stringify(Excalibur.signJSON(dataSet, excPreloadedPrivateKey, JSON.stringify));
			})
			.add('Multiple Excalibur Sign with preloaded key', () =>
			{
				for ( let i = 0; i < 100; ++i )
				{
					JSON.stringify(Excalibur.signJSON(dataSet, excPreloadedPrivateKey, JSON.stringify));
				}
			})
			.add('Multiple Excalibur Sign with preloaded key async',{
				defer: true,
				fn: async (deferred) =>
				{
					const tasks = [];
					for ( let i = 0; i < 100; ++i )
					{
						tasks.push(Excalibur.signJSONAsync(dataSet, excPreloadedPrivateKey, JSON.stringify)
						.then((result)=> JSON.stringify(result)));
					}

					await Promise.all( tasks );

					deferred.resolve();
				}
			} )
			.on('cycle', function (event)
			{
				console.log( `${event.currentTarget.name}: ${String(event.target)}` );
			})
			.on('complete', function ()
			{
				console.log(`Fastest is ${this.filter('fastest').map('name')}`);
			})
			.run();

		new Benchmark.Suite( `Verify '${setName}'` )
			.add('JOSE Verify', {
				defer: true,
				fn: async ( deferred ) =>
				{
					const key = await jose.JWK.asKey(publicKeyPem, 'pem');
					const verifier = jose.JWS.createVerify(key);
					
					await verifier.verify(pregeneratedToken);
	
					deferred.resolve();
				}
			})
			.add('JOSE Verify with preloaded public key', {
				defer: true,
				fn: async ( deferred ) =>
				{
					const verifier = jose.JWS.createVerify(preloadedPublicKey);
					
					await verifier.verify(pregeneratedToken);
	
					deferred.resolve();
				}
			})
			.add('Excalibur Verify', () =>
			{
				Excalibur.verifyJSON(presigned, publicKeyPem);
			})
			.add('Excalibur Verify with preloaded private key', () =>
			{
				Excalibur.verifyJSON(presigned, excPreloadedPublicKey);
			})
			.on('cycle', function (event)
			{
				console.log( `${event.currentTarget.name}: ${String(event.target)}` );
			})
			.on('complete', function ()
			{
				console.log('Fastest is ' + this.filter('fastest').map('name'));
			})
			//.run();
	}
}

async function main()
{
	try
	{
		validateRSAKeyPair( publicKeyPem, privateKeyPem );

		// await test();
		await benchmark();
	}
	catch ( error )
	{
		console.error( error.stack || error.toString() );
	}
}

main();
