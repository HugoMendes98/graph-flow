import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { DtoToEntity } from "../dtos/_lib/entity/entity.types";
import { CategoryCreateDto, CategoryDto, CategoryUpdateDto } from "../dtos/category";

/**
 * Endpoint path for [categories]{@link CategoryDto} (without global prefix).
 */
export const CATEGORIES_ENDPOINT_PREFIX = "/v1/categories";

export type Category = Jsonify<CategoryDto>;
export type CategoryEndpoint<T extends Category | DtoToEntity<CategoryDto> = Category> =
	EntityEndpoint<T, CategoryCreateDto, CategoryUpdateDto>;
