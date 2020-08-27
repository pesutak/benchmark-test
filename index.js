const cr = require('./crypto');
const CryptoJS = require('crypto-js');

const data = [cr.data_with_cert, cr.data3]
const method = [
	cr.stringifyJSON,
	cr.stringifyJSON2,
	cr.flattenJSONtoSign
]

data.forEach(d => {
	console.log(d.name)
	method.forEach(m => {
		console.log(`sha256 ${CryptoJS.SHA256(m.call(cr,d)).toString()} ${m.name}`)
	})
})
