import { Collection } from "@mikro-orm/core";

/**
 * Extract the type of a Mikro-orm collection
 */
export type EntityFromCollection<T extends Collection<any>> = T extends Collection<infer U>
	? U
	: never;
