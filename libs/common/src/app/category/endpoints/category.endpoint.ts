import { Jsonify } from "type-fest";

import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { CategoryCreateDto, CategoryDto, CategoryUpdateDto } from "../dtos";

/**
 * Endpoint path for [categories]{@link CategoryDto} (without global prefix).
 */
export const CATEGORIES_ENDPOINT_PREFIX = "/v1/categories";

export type Category = Jsonify<CategoryDto>;
export type CategoryEndpoint<T extends Category | DtoToEntity<CategoryDto> = Category> =
	EntityEndpoint<T, CategoryCreateDto, CategoryUpdateDto>;
