import { Collection, Entity, EntityRepositoryType, ManyToMany, Property } from "@mikro-orm/core";
import { CategoryRelationsDto } from "~/app/common/dtos/category";
import { NodeRelationsDto } from "~/app/common/dtos/node";

import { CategoryRepository } from "./category.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";
import { Node } from "../node/node.entity";

/**
 * The entity class to manage categories
 */
@Entity({ customRepository: () => CategoryRepository })
export class Category extends EntityBase implements EntityWithRelations<CategoryRelationsDto> {
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: CategoryRepository;

	@Property({ unique: true })
	public name!: string;

	@ManyToMany(() => Node, node => node.categories)
	public nodes? = new Collection<NodeRelationsDto>(this);
}
