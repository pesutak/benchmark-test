const cr = require('./crypto');
const data = require('./data')
const CryptoJS = require('crypto-js');


const dataset = [data.small, data.big, data.super_big]
const method = [
	cr.stringifyJSON,
	cr.stringifyJSON2,
	cr.stringifyJSON3,
	cr.flattenJSONtoSign
]

const a = {
	d: 1,
	banner: {
		dedo: "value",
		alfa: {
			what: "hello",
			aa: 32
		},
		abu: 8
	},
	abba: "a"
}
console.log(cr.stringifyJSON3(a))

dataset.forEach(d => {
	console.log(d.name + ' (' + JSON.stringify(d).length + ')')
	method.forEach(m => {	
		console.log(`sha256 ${CryptoJS.SHA256(m.call(cr,d)).toString()} ${m.name}`)
	})
})
