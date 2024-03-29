import { Jsonify } from "type-fest";

import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { CategoryCreateDto, CategoryDto, CategoryUpdateDto } from "../dtos";

/**
 * Endpoint path for [categories]{@link CategoryDto} (without global prefix).
 */
export const CATEGORIES_ENDPOINT_PREFIX = "/v1/categories";

export type CategoryJSON = Jsonify<CategoryDto>;
export type CategoryEndpoint<
	T extends CategoryJSON | DtoToEntity<CategoryDto> = CategoryJSON
> = EntityEndpoint<T, CategoryCreateDto, CategoryUpdateDto>;
