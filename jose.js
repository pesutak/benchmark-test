var node_jose = require("node-jose");


//const jose = require('jose')

var pem = "-----BEGIN RSA PRIVATE KEY-----" +
"MIICWwIBAAKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw"+
"33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW"+
"+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQAB"+
"AoGAD+onAtVye4ic7VR7V50DF9bOnwRwNXrARcDhq9LWNRrRGElESYYTQ6EbatXS"+
"3MCyjjX2eMhu/aF5YhXBwkppwxg+EOmXeh+MzL7Zh284OuPbkglAaGhV9bb6/5Cp"+
"uGb1esyPbYW+Ty2PC0GSZfIXkXs76jXAu9TOBvD0ybc2YlkCQQDywg2R/7t3Q2OE"+
"2+yo382CLJdrlSLVROWKwb4tb2PjhY4XAwV8d1vy0RenxTB+K5Mu57uVSTHtrMK0"+
"GAtFr833AkEA6avx20OHo61Yela/4k5kQDtjEf1N0LfI+BcWZtxsS3jDM3i1Hp0K"+
"Su5rsCPb8acJo5RO26gGVrfAsDcIXKC+bQJAZZ2XIpsitLyPpuiMOvBbzPavd4gY"+
"6Z8KWrfYzJoI/Q9FuBo6rKwl4BFoToD7WIUS+hpkagwWiz+6zLoX1dbOZwJACmH5"+
"fSSjAkLRi54PKJ8TFUeOP15h9sQzydI8zJU+upvDEKZsZc/UhT/SySDOxQ4G/523"+
"Y0sz/OZtSWcol/UMgQJALesy++GdvoIDLfJX5GBQpuFgFenRiRDabxrE9MNUZ2aP"+
"FaFp+DyAe+b4nDwuJaW2LURbr8AEZga7oQj0uYxcYw=="+
"-----END RSA PRIVATE KEY-----";

async function jose_test(){

    var key = await node_jose.JWK.asKey(pem, "pem");

    const data1 = {"sub": "1234567890",  "name": "Eric D.",  "role": "admin","iat": 1516239022};
    const data2 = {"name": "Eric D.", "sub": "1234567890",  "role": "admin","iat": 1516239022};

    var payload =JSON.stringify(data2);
    var token = await node_jose.JWS.createSign({alg: "RS256", format: 'flattened'}, key).update(payload, "utf8").final();
    console.log("token", token);
    
    // var payload2 =JSON.stringify({"role": "admin","iat": 1516239022, "sub": "1234567890",  "name": "Eric D." });
    // var token2 = await node_jose.JWS.createSign({alg: "RS256", format: 'flattened'}, key).update(payload2, "utf8").final();
    //console.log(token2);

    node_jose.JWS.createVerify(key)
    .verify(token)
    .then(function(result) {
          console.log("verify", result);
          var output = node_jose.util.base64url.encode(result.payload);
          console.log("output", output);

          return result;
    }); 
}

jose_test();

//const privateKey = jose.JWK.asKey('/opt/excalibur/swarm/dashboard.key');
//const publicKey = jose.JWK.asKey('/opt/excalibur/swarm/dashboard.crt');

key = jose.JWK.generateSync('OKP', 'Ed25519')

console.log(key)

// var jwt = jose.JWT.sign(
//     { 'bbb': 2, 'aaa': 1 },
//     key
// )

// console.log("JWT", jwt);


// const verify = jose.JWT.verify(
//     'eyJraWQiOiI0czlZd2lnaFRrQ1M1aFVCVmZCNmVCWW93ZzNuNGtKTXZ3N2l4cTdmQXJZIiwiYWxnIjoiRWREU0EifQ.eyJiYmIiOjIsImFhYSI6MSwiaWF0IjoxNTk4NjE2NzAzfQ.w5G7u8VEwaEAP1WY0y90LJGIYZcAgm3bba-TFFUfry9c7u4Jy43gR9Z8SOvvx15dkDNOuJqxqTcora4zSYLHAQ',
//     //jwt,
//     key
// );
// console.log("VERIFY", verify);




// var sign = jose.JWS.sign(
//     //{ sub: 'johndoe' },
//     { 'aaa': 1, 'bbb': 2 },
//     key
// )

// console.log('sign:',sign)


// var verify = jose.JWS.verify(
//     'eyJhbGciOiJFZERTQSJ9.eyJiYmIiOjIsImFhYSI6MX0.cyXdarXKcD902z5Z3JdeF76-Tw8M_J_BQHHG5MIUDwyfPmrXDH6GOzDimF5e7a-VyqqUABJ40Flfpsr2et0zAg',
//     //sign,
//     key
// )

// console.log('verify:',verify)