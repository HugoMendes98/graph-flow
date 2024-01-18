export interface LoggerTest {
	/**
	 * A simple empty line
	 */
	emptyLine(): this;
	/**
	 * Same as `console.error`
	 */
	error(...data: unknown[]): this;
	/**
	 * A simple separating line
	 */
	line(): this;
	/**
	 * Same as `console.log`
	 */
	log(...data: unknown[]): this;
}

/* eslint-disable no-console -- console wrapper */
class Logger implements LoggerTest {
	private readonly _line: string;

	public constructor(private readonly prefix: string) {
		this._line = this.generatePrefix().replaceAll(/./g, "-");
	}

	public emptyLine(): this {
		console.log();
		return this;
	}
	public error(...data: unknown[]) {
		console.error(this.generatePrefix(), ...data);
		return this;
	}
	public line(): this {
		console.log(this._line);
		return this;
	}
	public log(...data: unknown[]) {
		console.log(this.generatePrefix(), ...data);
		return this;
	}

	private generatePrefix() {
		return `[${new Date().toISOString()} ${this.prefix}]:`;
	}
}
/* eslint-enable */

class Dummy implements LoggerTest {
	public emptyLine(): this {
		return this;
	}
	public error() {
		return this;
	}
	public line() {
		return this;
	}
	public log() {
		return this;
	}
}

export const LoggerTest: (
	dummy?: boolean
) => (prefix: string) => LoggerTest = dummy =>
	dummy ? () => new Dummy() : prefix => new Logger(prefix);
