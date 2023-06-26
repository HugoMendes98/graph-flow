import "jest-preset-angular/setup-jest";

/* eslint-disable no-console -- hook for test lib code */
const nativeConsoleError = console.error;
console.error = (...args: unknown[]) => {
	nativeConsoleError(...args);
	throw new Error("A console.error = failed test");
};
/* eslint-enable */
