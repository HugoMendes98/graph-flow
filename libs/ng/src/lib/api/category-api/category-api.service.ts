import { Injectable } from "@angular/core";
import { CategoryCreateDto, CategoryUpdateDto } from "~/app/common/dtos/category";
import { CATEGORIES_ENDPOINT_PREFIX, Category, CategoryEndpoint } from "~/app/common/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the category API.
 */
@Injectable({
	providedIn: "root"
})
export class CategoryApiService
	extends EntityApiService<Category, CategoryCreateDto, CategoryUpdateDto>
	implements CategoryEndpoint<true>
{
	public override getEntrypoint(): string {
		return CATEGORIES_ENDPOINT_PREFIX;
	}
}
