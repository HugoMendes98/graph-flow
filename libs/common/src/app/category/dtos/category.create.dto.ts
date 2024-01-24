import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";

import { CategoryDto } from "./category.dto";
import { ENTITY_BASE_KEYS } from "../../../dtos/entity";

/**
 * The mandatory keys to create a [category]{@link CategoryDto}.
 */
export const CATEGORY_CREATE_KEYS_MANDATORY = [
	"name"
] as const satisfies ReadonlyArray<keyof CategoryDto>;

/**
 * DTO used to create [category]{@link CategoryDto}
 * in its {@link CategoryEndpoint endpoint}.
 */
export class CategoryCreateDto extends IntersectionType(
	PickType(CategoryDto, CATEGORY_CREATE_KEYS_MANDATORY),
	OmitType(CategoryDto, [
		...ENTITY_BASE_KEYS,
		...CATEGORY_CREATE_KEYS_MANDATORY
	])
) {}
