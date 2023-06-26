/**
 * A (lazy) Singleton class that will store a single value.
 * The value will only be loaded when asked (lazy).
 *
 * It also works with promised values as they are only fulfilled once.
 *
 * @see {@link https://en.wikipedia.org/wiki/Singleton_pattern}
 */
export class Singleton<T> {
	// There is no invalidate method.
	// If one is needed, an Observable/BehaviorSubject (RxJs) should probably be used.

	/**
	 * Has the Singleton be called ?
	 */
	private loaded = false;
	/**
	 * The singleton value.
	 * It can not be used to determine if it is initialized: The final value could be falsy
	 */
	private value?: T;

	/**
	 * Creates a Singleton
	 *
	 * @param loader The function called to load the singleton value
	 */
	public constructor(private readonly loader: () => T) {}

	/**
	 * Runs the loader, if it has not already been loaded and returns the value
	 *
	 * @returns The value of this singleton
	 */
	public get(): T {
		if (!this.loaded) {
			this.loaded = true;
			this.value = this.loader();
		}

		return this.value as T;
	}
}
