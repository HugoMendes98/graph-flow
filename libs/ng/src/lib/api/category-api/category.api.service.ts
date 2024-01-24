import { Injectable } from "@angular/core";
import {
	CategoryCreateDto,
	CategoryUpdateDto
} from "~/lib/common/app/category/dtos";
import {
	CATEGORIES_ENDPOINT_PREFIX,
	CategoryJSON,
	CategoryEndpoint
} from "~/lib/common/app/category/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the category API.
 */
@Injectable({ providedIn: "root" })
export class CategoryApiService
	extends EntityApiService<CategoryJSON, CategoryCreateDto, CategoryUpdateDto>
	implements CategoryEndpoint
{
	public override getEntrypoint(): string {
		return CATEGORIES_ENDPOINT_PREFIX;
	}
}
