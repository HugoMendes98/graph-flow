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

import { NodeBehavior } from "./behaviors/node-behavior";
import { NodeBehaviorBase } from "./behaviors/node-behavior.base";
import { NodeInput } from "./input/node-input.entity";
import { NodeKindBaseEntity, NodeKindEntity } from "./kind";
import { NodeRepository } from "./node.repository";
import { NodeOutput } from "./output/node-output.entity";
import { EntityBase, EntityToDto } from "../_lib/entity";
import { Category } from "../category/category.entity";

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
	@OneToOne(() => NodeBehaviorBase, ({ pkNode }) => pkNode, {
		eager: true,
		owner: false,
		// This strategy is "kinda mandatory" with manual populate
		strategy: LoadStrategy.JOINED
	})
	public readonly behavior!: NodeBehavior;

	/**
	 * @inheritDoc
	 */
	@OneToOne(() => NodeKindBaseEntity, ({ node }) => node, {
		eager: true,
		owner: false,
		// Same as above
		strategy: LoadStrategy.JOINED
	})
	public readonly kind!: NodeKindEntity;

	// ------- Relations -------

	@OneToMany(() => NodeInput, ({ node }) => node, {
		eager: true,
		orderBy: { _id: "asc" }
	})
	public readonly inputs = new Collection<NodeInput>(this);
	@OneToMany(() => NodeOutput, ({ node }) => node, {
		eager: true,
		orderBy: { _id: "asc" }
	})
	public readonly outputs = new Collection<NodeOutput>(this);

	@ManyToMany(() => Category, ({ nodes }) => nodes, { hidden: true, owner: true })
	public readonly categories? = new Collection<Category>(this);

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
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- From override
			kind: super.toJSON!.call(this.kind),
			outputs: this.outputs.toJSON()
		};
	}
}
