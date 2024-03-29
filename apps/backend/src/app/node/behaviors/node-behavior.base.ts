import { Entity, EntityOptions, Enum, OneToOne } from "@mikro-orm/core";
import {
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey
} from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeEntity } from "../node.entity";

/**
 * Base options of "node-behavior" entities
 */
export const NODE_BEHAVIOR_ENTITY_OPTIONS = {
	discriminatorColumn: "type" satisfies NodeBehaviorDiscriminatorKey,
	tableName: "node_behavior"
} as const satisfies EntityOptions<NodeBehaviorBase>;

@Entity({
	...NODE_BEHAVIOR_ENTITY_OPTIONS,
	abstract: true
})
export abstract class NodeBehaviorBase<
	Type extends NodeBehaviorType = NodeBehaviorType
> implements NodeBehaviorBaseDto
{
	/** @inheritDoc */
	@Enum({ items: () => NodeBehaviorType, type: () => NodeBehaviorType })
	public readonly type!: Type;

	// The owing side is here, so the primary key is also the foreign key
	@OneToOne(() => NodeEntity, {
		eager: false,
		hidden: true,
		onDelete: "cascade",
		onUpdateIntegrity: "cascade",
		owner: true,
		primary: true
	})
	public readonly pkNode?: NodeEntity;
}
