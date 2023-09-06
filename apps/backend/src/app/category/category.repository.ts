import { EntityRepository } from "@mikro-orm/core";

import { Category } from "./category.entity";

/**
 * The repository to manage [categories]{@link Category}.
 */
export class CategoryRepository extends EntityRepository<Category> {}
