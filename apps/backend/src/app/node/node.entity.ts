import { Collection, Entity, LoadStrategy, ManyToMany, OneToOne, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { NodeDto } from "~/lib/common/dtos/node";

import { NodeBehavior, NodeBehaviorBase } from "./behaviors";
import { NodeRepository } from "./node.repository";
import { EntityBase } from "../_lib/entity";
import { Category } from "../category/category.entity";

/**
 * The entity class to manage nodes
 */
@Entity({ customRepository: () => NodeRepository })
export class Node extends EntityBase implements DtoToEntity<NodeDto> {
	@Property()
	public name!: string;

	@OneToOne(() => NodeBehaviorBase, ({ node }) => node, {
		owner: false,
		strategy: LoadStrategy.JOINED
	})
	public readonly behavior!: NodeBehavior;

	// ------- Relations -------

	@ManyToMany(() => Category, ({ nodes }) => nodes, { owner: true })
	public readonly categories? = new Collection<Category>(this);

	public override toJSON?(): this {
		if (super.toJSON) {
			return { ...super.toJSON(), behavior: super.toJSON.call(this.behavior) };
		}

		return this;
	}
}
