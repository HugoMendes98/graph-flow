export type DbTestSample = "base";

export const DB_TEST_SAMPLE_VALUES = ["base"] as const satisfies readonly DbTestSample[];

/**
 * @param value The value to test
 * @returns if the value is a sample name value
 */
export function isDbTestSampleValid(value: string): value is DbTestSample {
	return DB_TEST_SAMPLE_VALUES.includes(value as DbTestSample);
}
