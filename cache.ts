/**
 * TTL cache implementation
 * 
 * TODO Comment
 */
import { Time } from './time';

type Key = number | string;

interface WrappedValue<T>
{
	created: number,
	ttl: number;
	value: T;
}

interface CacheOptions
{
	/**
	 * Maximum number of items stored in cache
	 */
	maxItems? : number;
	/**
	 * Time in milliseconds in which timer will check for
	 * outdated items
	 */
	resolution? : number;
	/**
	 * Default timeout for added item
	 */
	defaultTTL? : number;
}

export class Cache<T>
{
	private options : CacheOptions;
	private cache = new Map<Key, WrappedValue<T>>();
	private timer : NodeJS.Timeout;

	constructor( options : CacheOptions = {} )
	{
		const defaultOptions =
		{
			maxItems: 1000,
			resolution: 1000,
			// Default timeout is infinity
			defaultTTL: Number.POSITIVE_INFINITY
		};

		this.options =
		{
			...defaultOptions,
			...options
		};

		this.timer = setInterval( () => this.cleanup(), options.resolution );
		this.timer.unref();

	}

	public set( key : Key, value : T, ttl? : number ) : Cache<T>
	{
		const now = Time.getMiliseconds();

		const wrapped : WrappedValue<T> =
		{
			created: now,
			value,
			ttl: ttl ?? this.options.defaultTTL
		};

		this.cache.set( key, wrapped );

		return this;
	}

	/**
	 * Returns value by its key
	 * 
	 * @param key Key of value to get
	 * @param refresh True to refresh item TTL or false to not
	 */
	public get( key : Key, refresh = false ) : T | undefined
	{
		const wrapped = this.cache.get( key );
		if ( wrapped )
		{
			if ( refresh )
			{
				const now = Time.getMiliseconds();

				wrapped.created = now;
			}
		}

		return wrapped?.value;
	}

	public has( key : Key ) : boolean
	{
		return this.cache.has( key );
	}

	public delete( key : Key ) : boolean
	{
		return this.cache.delete( key );
	}

	public get size() : number
	{
		return this.cache.size;
	}

	public forEach( cb : ( value: T, key : Key ) => void ) : void
	{
		this.cache.forEach( ( value, key ) =>
		{
			cb( value.value, key );
		} );
	}

	public destroy() : void
	{
		clearInterval( this.timer );
		delete this.cache;
	}

	private cleanup()
	{
		if ( this.cache.size === 0 )
		{
			return;
		}

		const now = Time.getMiliseconds();

		for ( const [ key, value ] of this.cache )
		{
			if ( now > ( value.created + value.ttl ) )
			{
				this.cache.delete( key );
			}
		}
	}
}
