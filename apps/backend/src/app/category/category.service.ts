import { Injectable } from "@nestjs/common";
import { CategoryCreateDto, CategoryUpdateDto } from "~/lib/common/app/category/dtos";

import { CategoryEntity } from "./category.entity";
import { CategoryRepository } from "./category.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [categories]{@link category}.
 */
@Injectable()
export class CategoryService extends EntityService<
	CategoryEntity,
	CategoryCreateDto,
	CategoryUpdateDto
> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param repository injected
	 */
	public constructor(repository: CategoryRepository) {
		super(repository);
	}
}
