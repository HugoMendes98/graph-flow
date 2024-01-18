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

import { NodeBehaviorBase } from "./behaviors/node-behavior.base";
import { NodeBehaviorEntity } from "./behaviors/node-behavior.entity";
import { NodeInputEntity } from "./input/node-input.entity";
import { NodeKindBaseEntity, NodeKindEntity } from "./kind";
import { NodeRepository } from "./node.repository";
import { NodeOutputEntity } from "./output/node-output.entity";
import { EntityBase, EntityToDto } from "../_lib/entity";
import { CategoryEntity } from "../category/category.entity";

/**
 * The entity class to manage nodes
 */
@Entity({ customRepository: () => NodeRepository })
export class NodeEntity extends EntityBase implements DtoToEntity<NodeDto> {
	/** @inheritDoc */
	@Property()
	public name!: string;

	/** @inheritDoc */
	@OneToOne(() => NodeBehaviorBase, ({ pkNode }) => pkNode, {
		eager: true,
		owner: false,
		// This strategy is "kinda mandatory" with manual populate
		strategy: LoadStrategy.JOINED
	})
	public readonly behavior!: NodeBehaviorEntity;

	/** @inheritDoc */
	@OneToOne(() => NodeKindBaseEntity, ({ node }) => node, {
		eager: true,
		owner: false,
		// Same as above
		strategy: LoadStrategy.JOINED
	})
	public readonly kind!: NodeKindEntity;

	// ------- Relations -------

	@OneToMany(() => NodeInputEntity, ({ node }) => node, {
		eager: true,
		orderBy: { _id: "asc" }
	})
	public readonly inputs = new Collection<NodeInputEntity>(this);
	@OneToMany(() => NodeOutputEntity, ({ node }) => node, {
		eager: true,
		orderBy: { _id: "asc" }
	})
	public readonly outputs = new Collection<NodeOutputEntity>(this);

	@ManyToMany(() => CategoryEntity, ({ nodes }) => nodes, {
		hidden: true,
		owner: true
	})
	public readonly categories? = new Collection<CategoryEntity>(this);

	/** @inheritDoc */
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
