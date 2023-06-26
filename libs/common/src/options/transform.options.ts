import { ClassTransformOptions } from "class-transformer";

/**
 * The default [options]{@link ClassTransformOptions}
 * when using the `class-transformer` [transform]{@link plainToInstance} functions.
 */
export const transformOptions = Object.freeze<ClassTransformOptions>({
	// Do not activate or too much data will be converted (example in query params)
	enableImplicitConversion: false,
	exposeUnsetFields: false
});
