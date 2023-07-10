import {
	Collection,
	Embedded,
	Entity,
	EntityRepositoryType,
	ManyToMany,
	Property
} from "@mikro-orm/core";
import { CategoryRelationsDto } from "~/app/common/dtos/category";
import { NodeRelationsDto } from "~/app/common/dtos/node";

import { NodeBehavior, NODE_BEHAVIORS_ENTITIES } from "./node-behaviors";
import { NodeRepository } from "./node.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";
import { Category } from "../category/category.entity";

/**
 * The entity class to manage nodes
 */
@Entity({ customRepository: () => NodeRepository })
export class Node extends EntityBase implements EntityWithRelations<NodeRelationsDto> {
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: NodeRepository;

	@Property({ unique: true })
	public name!: string;

	// https://mikro-orm.io/docs/embeddables#polymorphic-embeddables
	// TODO: If the embedded entities use foreign key, `object: true` must probably be removed
	// TODO: OneToOne ?
	@Embedded(() => NODE_BEHAVIORS_ENTITIES, { object: true })
	public behavior!: NodeBehavior;

	@ManyToMany(() => Category, category => category.nodes, { owner: true })
	public categories? = new Collection<CategoryRelationsDto>(this);
}
