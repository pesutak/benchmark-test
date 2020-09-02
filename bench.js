const crypto = require('./crypto')
const data = require('./data')

const Benchmark = require('benchmark')
const suite_small = new Benchmark.Suite
const suite_big = new Benchmark.Suite

const big_data = data.super_big
const small_data = data.small

// add tests
suite_small
	.add('small-method-paco', function() {
  	crypto.stringifyJSON(small_data)
	},)

	.add('small-method-pixon', function() {
		crypto.stringifyJSON2(small_data)
	},)

	.add('small-method-alex', function() {
		crypto.flattenJSONtoSign(small_data)
	},)
	
	.add('small-method-canonicalize', function() {
		crypto.canonicalize(small_data)
	},)
	
	.on('cycle', function(event) {
		console.log(String(event.target));
	})

	.on('complete', function() {
		console.log('SMALL Fastest is ' + this.filter('fastest').map('name'));
	})
	
	// run async
	.run({ 'async': false });

	suite_big
	.add('big-method-paco', function() {
  	crypto.stringifyJSON(big_data)
	},)

	.add('big-method-pixon', function() {
		crypto.stringifyJSON2(big_data)
	},)

	.add('big-method-alex', function() {
		crypto.flattenJSONtoSign(big_data)
	},)

	.add('big-method-canonicalize', function() {
		crypto.canonicalize(big_data)
	},)

	.on('cycle', function(event) {
		console.log(String(event.target));
	})

	.on('complete', function() {
		console.log('BIG Fastest is ' + this.filter('fastest').map('name'));
	})
	
	// run async
	.run({ 'async': false });
