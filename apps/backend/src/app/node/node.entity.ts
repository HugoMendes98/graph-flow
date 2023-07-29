import { Collection, Entity, LoadStrategy, ManyToMany, OneToOne, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { NodeDto } from "~/lib/common/dtos/node";

import { NodeBehavior, NodeBehaviorBase } from "./behaviors";
import { NodeRepository } from "./node.repository";
import { EntityBase, EntityToDto } from "../_lib/entity";
import { Category } from "../category/category.entity";

/**
 * The entity class to manage nodes
 */
@Entity({ customRepository: () => NodeRepository })
export class Node extends EntityBase implements DtoToEntity<NodeDto> {
	@Property()
	public name!: string;

	@OneToOne(() => NodeBehaviorBase, ({ node }) => node, {
		eager: true,
		owner: false,
		strategy: LoadStrategy.JOINED
	})
	public readonly behavior!: NodeBehavior;

	// ------- Relations -------

	@ManyToMany(() => Category, ({ nodes }) => nodes, { hidden: true, owner: true })
	public readonly categories? = new Collection<Category>(this);

	public override toJSON?(): EntityToDto<this> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Override only applied if the parent function exists
		return { ...super.toJSON!(), behavior: super.toJSON!.call(this.behavior) };
	}
}
