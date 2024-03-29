import type { Type } from "@nestjs/common";

import { DtoError } from "./dto.error";
import { DtoPropertyKey, DtoPropertyOptions, DtoType } from "./dto.types";

import "reflect-metadata";

/**
 * Returns true if the object is a function.
 *
 * @param value The value to check
 */
function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

/**
 * This class stores the data about the DTO properties.
 */
class DtoStorage {
	/**
	 * The meta key used to store metadata
	 */
	private readonly META_INFO = Symbol("dto:options");
	/**
	 * Know properties for know types
	 */
	private readonly properties = new Map<Type<unknown>, Set<DtoPropertyKey>>();

	/**
	 * Add the given property key for the given constructor.
	 *
	 * @param target The object containing the property
	 * 	From decorators, `target.constructor` is the expected variable
	 * @param propertyKey The key of the property to add
	 */
	public addPropertyKey(target: Type<unknown>, propertyKey: DtoPropertyKey) {
		// Get the current properties
		let properties = this.properties.get(target);
		if (!properties) {
			// If not present, assign an empty set
			this.properties.set(target, (properties = new Set()));
		}

		// Add the current property to the set
		properties.add(propertyKey);
	}

	/**
	 * Gets the properties for a given class
	 *
	 * @param source The object to look for registered properties
	 * @throws DtoError when the source is undefined
	 * @returns The know properties of the given class
	 */
	public getPropertyKeys(source: DtoType): Set<DtoPropertyKey> {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Can happen when reading a class with circular import.
		if (source === null || source === undefined) {
			throw new DtoError(
				"Can not get the property of an `null` or `undefined` source." +
					"Does the class have a circular dependence?"
			);
		}

		// The current one is the newest ancestor
		let ancestor: unknown = source;
		const ancestors: Array<Type<unknown>> = [];
		do {
			// Add the current ancestor to the list
			ancestors.push(ancestor as Type<unknown>);
			ancestor = Object.getPrototypeOf(ancestor);
			// Continue if the current ancestor is still a class
		} while (ancestor && isFunction(Object.getPrototypeOf(ancestor)));

		return new Set(
			// Get all keys in order from the oldest class to newest
			ancestors
				.slice()
				.reverse()
				.flatMap(ancestor => {
					const properties = this.properties.get(ancestor);
					return properties ? Array.from(properties) : [];
				})
		);
	}

	/**
	 * Store data for property.
	 *
	 * @param target The target to store the metadata
	 * @param propertyKey The key of the property to store metadata
	 * @param options Options to store the metadata
	 */
	public storePropertyOptions(
		target: Type<unknown>,
		propertyKey: DtoPropertyKey,
		options?: DtoPropertyOptions
	) {
		// Store metadata about the property in the "metadata property space"
		Reflect.metadata(this.META_INFO, options)(target, propertyKey);
	}

	/**
	 * Get (calculate) the possible type for a property.
	 *
	 * @param source Where to look for the property. `source.prototype` from class type
	 * @param propertyKey The key of the property to look for
	 * @throws DtoError
	 * @returns The type found for the property
	 */
	public getPropertyType<T = object>(
		source: Type<unknown>,
		propertyKey: DtoPropertyKey
	): DtoType<T> {
		const options = this.getPropertyOptions(source, propertyKey);

		if (options?.type) {
			// TODO: a way to get from the class-transformer directly or use the DtoDecorator to set class-transformer
			const forwardType = options.type();
			if (forwardType === null) {
				throw new DtoError(
					"Can do nothing with a `null` only type or unknown type."
				);
			}

			return forwardType;
		}

		const metadataType = Reflect.getMetadata(
			"design:type",
			source,
			propertyKey
		) as Type<unknown> | undefined;
		if (metadataType === undefined) {
			throw new DtoError(
				"Can do nothing with a `null` only type or unknown type."
			);
		}

		return metadataType as DtoType<T>;
	}

	/**
	 * @param source The source where the options ares stored
	 * @param propertyKey The key of the property to search
	 * @returns The Option, if found,
	 */
	public getPropertyOptions<
		T = never,
		P extends Extract<keyof T, string> = never
	>(source: Type<unknown>, propertyKey: DtoPropertyKey) {
		return Reflect.getMetadata(this.META_INFO, source, propertyKey) as
			| DtoPropertyOptions<T, P>
			| undefined;
	}
}

/**
 * The storage for DTO metadata
 */
export const dtoStorage = new DtoStorage();
