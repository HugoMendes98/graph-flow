import {
	Collection,
	Entity,
	LoadStrategy,
	ManyToMany,
	OneToMany,
	OneToOne,
	Property
} from "@mikro-orm/core";
import { NodeDto } from "~/lib/common/app/node/dtos";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { NodeBehavior, NodeBehaviorBase } from "./behaviors";
import { NodeInput } from "./input/node-input.entity";
import { NodeRepository } from "./node.repository";
import { NodeOutput } from "./output/node-output.entity";
import { EntityBase, EntityToDto } from "../_lib/entity";
import { Category } from "../category/category.entity";
import { GraphNode } from "../graph/node/graph-node.entity";

/**
 * The entity class to manage nodes
 */
@Entity({ customRepository: () => NodeRepository })
export class Node extends EntityBase implements DtoToEntity<NodeDto> {
	/**
	 * @inheritDoc
	 */
	@Property()
	public name!: string;

	/**
	 * @inheritDoc
	 */
	@OneToOne(() => NodeBehaviorBase, ({ node }) => node, {
		eager: true,
		owner: false,
		strategy: LoadStrategy.JOINED
	})
	public readonly behavior!: NodeBehavior;

	// ------- Relations -------

	@OneToMany(() => NodeInput, ({ node }) => node, { eager: true, orderBy: { _id: "desc" } })
	public readonly inputs = new Collection<NodeInput>(this);
	@OneToMany(() => NodeOutput, ({ node }) => node, { eager: true, orderBy: { _id: "desc" } })
	public readonly outputs = new Collection<NodeOutput>(this);

	@ManyToMany(() => Category, ({ nodes }) => nodes, { hidden: true, owner: true })
	public readonly categories? = new Collection<Category>(this);

	@OneToMany(() => GraphNode, ({ node }) => node, { lazy: true })
	public readonly graphNodes? = new Collection<GraphNode>(this);

	/**
	 * @inheritDoc
	 */
	public override toJSON?(): EntityToDto<this> {
		return {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From override
			...super.toJSON!(),
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From override
			behavior: super.toJSON!.call(this.behavior),
			inputs: this.inputs.toJSON(),
			outputs: this.outputs.toJSON()
		};
	}
}
