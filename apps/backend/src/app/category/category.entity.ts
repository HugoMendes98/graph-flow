import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { CategoryDto } from "~/lib/common/dtos/category";

import { CategoryRepository } from "./category.repository";
import { EntityBase } from "../_lib/entity";
import { Node } from "../node/node.entity";

/**
 * The entity class to manage categories
 */
@Entity({ customRepository: () => CategoryRepository })
export class Category extends EntityBase implements DtoToEntity<CategoryDto> {
	@Property({ unique: true })
	public name!: string;

	// ------- Relations -------

	@ManyToMany(() => Node, node => node.categories)
	public readonly nodes? = new Collection<Node>(this);
}
