import { Injectable } from "@nestjs/common";
import { CategoryCreateDto, CategoryUpdateDto } from "~/lib/common/dtos/category";

import { Category } from "./category.entity";
import { CategoryRepository } from "./category.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [categories]{@link category}.
 */
@Injectable()
export class CategoryService extends EntityService<Category, CategoryCreateDto, CategoryUpdateDto> {
	public constructor(repository: CategoryRepository) {
		super(repository);
	}
}
