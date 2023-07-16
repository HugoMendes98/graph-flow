import {
	Collection,
	Entity,
	EntityRepositoryType,
	ManyToMany,
	OneToOne,
	Property
} from "@mikro-orm/core";
import { CategoryRelationsDto } from "~/app/common/dtos/category";
import { NodeRelationsDto } from "~/app/common/dtos/node";

import { NodeBehavior, NodeBehaviorBase } from "./behaviors";
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

	@OneToOne(() => NodeBehaviorBase, { eager: true, owner: true })
	public readonly behavior!: NodeBehavior;

	@ManyToMany(() => Category, category => category.nodes, { owner: true })
	public categories? = new Collection<CategoryRelationsDto>(this);

	public override toJSON?(): this {
		if (super.toJSON) {
			return { ...super.toJSON(), behavior: super.toJSON.call(this.behavior) };
		}

		return this;
	}
}
