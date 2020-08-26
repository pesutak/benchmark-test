const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;

// add tests
suite
	.add('RegExp#test', function() {
  		/o/.test('Hello World!');
	})
	.add('String#indexOf', function() {
		//sleep(10).then(()=>{
			'Hello World!'.indexOf('o') > -1;
		//});
	})
	.add('String#match', function() {
			!!'Hello World!'.match(/o/);
	})
	// add listeners
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	// run async
	.run({ 'async': true });

	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}   

// dummy 1
// dummy 2
// dummy 3
// dummy 4
// dummy 5
// dummy 6
// dummy 7
// dummy 8
// dummy 9
// dummy 10
// dummy 11 (alert-threshold: '120%')
// dummy 11 (alert-threshold: '120%')
// dummy commit - Wed Aug 26 11:50:39 CEST 2020
// dummy commit - Wed Aug 26 11:55:35 CEST 2020
// dummy commit - Wed Aug 26 11:59:39 CEST 2020
// dummy commit - Wed Aug 26 12:03:43 CEST 2020
// dummy commit - Wed Aug 26 12:07:47 CEST 2020
// dummy commit - Wed Aug 26 12:11:51 CEST 2020
// dummy commit - Wed Aug 26 12:34:39 CEST 2020
