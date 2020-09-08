/**
 * 
 */
export class Time
{
	static addMinutes( date : Date, minutes : number ) : Date
	{
		date.setMinutes( date.getMinutes() + minutes );

		return date;
	}

	static getMiliseconds( date : Date = new Date() ) : number
	{
		return date.getTime();
	}

	static getSeconds( date : Date = new Date() ) : number
	{
		return Math.round( Time.getMiliseconds( date ) / 1000 );
	}

	// TODO timezone
	static getDayOfWeek( date: Date = new Date() ) : number
	{
		const day = ( ( date.getDay() + 6 ) % 7 );

		return day;
	}

	// TODO timezone
	static getTimeOfDay( date : Date = new Date() ) : string
	{
		const hours = `0${date.getHours()}`.substr( -2 );
		const minutes = `0${date.getMinutes()}`.substr( -2 );

		return `${hours}:${minutes}`;
	}

	//timezone v minutach
	static parse( date : number | string, timezone = 0 ) : Date
	{
		if ( typeof date === 'number' )
		{
			// TODO: tu netreba zohladnit timezone?
			return ( date < 4294967296 )
				? new Date( date * 1000 ) // TODO pozor ked pouzije velmi skori cas v ms, to by ale nemalo byt nikdy
				: new Date( date );
		}
		else if ( typeof date === 'string' )
		{
			const d = new Date( Date.parse( date ) );

			return ( timezone === 0 )
				? d
				: Time.addMinutes( d, timezone );
		}

		throw new Error( 'Invalid input data' );
	}

	static parseDay( date : number | string, timezone = 0 )
	{
		const day = Time.parse( date, timezone );

		const time = Math.floor( day.getTime() / 1000 );

		return {
			start: time,
			end: time + 24 * 60 * 60
		};
	}

	static parseDate( date : string | number, timezone = 0 ) // TODO timezone
	{
		const d = Time.parse( date, timezone );

		return Math.floor( d.getTime() / 1000 );
	}

	static timezone( time : number ) : number
	{
		let timezone = 0;

		if ( time <= 1521946800 // < 2018 zimny
			|| ( time > 1540692000 && time <= 1554001200 ) //2018-2019 zimny
			|| ( time > 1572141600 && time <= 1585450800 ) //2019-2020 zimny
			|| ( time > 1603591200 && time <= 1616900400 ) //2020-2021 zimny
			|| ( time > 1635645600 ) // 2021 >  zimny
		)
		{
			timezone = -60;
		}
		else
		{
			timezone = -120;
		}

		return timezone;
	}
}
