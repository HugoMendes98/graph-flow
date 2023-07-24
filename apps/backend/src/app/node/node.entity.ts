import {
	Collection,
	Entity,
	EntityRepositoryType,
	LoadStrategy,
	ManyToMany,
	OneToOne,
	Property
} from "@mikro-orm/core";
import { NodeRelationsDto } from "~/lib/common/dtos/node";

import { NodeBehavior, NodeBehaviorBase } from "./behaviors";
import { NodeRepository } from "./node.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";
import { Category } from "../category/category.entity";

/**
 * The entity class to manage nodes
 */
@Entity({ customRepository: () => NodeRepository })
export class Node
	extends EntityBase
	implements EntityWithRelations<NodeRelationsDto, { categories: Category }>
{
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: NodeRepository;

	@Property()
	public name!: string;

	@OneToOne(() => NodeBehaviorBase, ({ node }) => node, {
		owner: false,
		strategy: LoadStrategy.JOINED
	})
	public readonly behavior!: NodeBehavior;

	@ManyToMany(() => Category, ({ nodes }) => nodes, { owner: true })
	public categories? = new Collection<Category>(this);

	public override toJSON?(): this {
		if (super.toJSON) {
			return { ...super.toJSON(), behavior: super.toJSON.call(this.behavior) };
		}

		return this;
	}
}
