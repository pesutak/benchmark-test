module.exports = class Stopwatch
{


	constructor()
	{
		this.reset();
	}

	reset()
	{
		this.begin = process.hrtime();
	}

	diff( digits = 3 )
	{
		const diff = process.hrtime( this.begin );
		const ms = diff[0] * 1000 + diff[1] / 1000 / 1000;

		return ms //.toFixed( digits );
	}
}