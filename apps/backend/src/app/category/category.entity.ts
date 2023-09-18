import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { CategoryDto } from "~/lib/common/app/category/dtos";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { CategoryRepository } from "./category.repository";
import { EntityBase } from "../_lib/entity";
import { NodeEntity } from "../node/node.entity";

/**
 * The entity class to manage categories
 */
@Entity({ customRepository: () => CategoryRepository })
export class CategoryEntity extends EntityBase implements DtoToEntity<CategoryDto> {
	/** @inheritDoc */
	@Property({ unique: true })
	public name!: string;

	// ------- Relations -------

	@ManyToMany(() => NodeEntity, node => node.categories)
	public readonly nodes? = new Collection<NodeEntity>(this);
}
