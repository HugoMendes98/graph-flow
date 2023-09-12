import { EntityRepository } from "@mikro-orm/core";

import { CategoryEntity } from "./category.entity";

/**
 * The repository to manage [categories]{@link CategoryEntity}.
 */
export class CategoryRepository extends EntityRepository<CategoryEntity> {}
