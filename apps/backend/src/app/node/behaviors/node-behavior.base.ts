import { Entity, EntityOptions, Enum, OneToOne } from "@mikro-orm/core";
import {
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors";

import { Node } from "../node.entity";

export const NODE_BEHAVIOR_ENTITY_OPTIONS = {
	discriminatorColumn: "type" satisfies NodeBehaviorDiscriminatorKey,
	tableName: "node_behavior"
	// eslint-disable-next-line no-use-before-define -- Defined just after
} as const satisfies EntityOptions<NodeBehaviorBase>;

@Entity({
	...NODE_BEHAVIOR_ENTITY_OPTIONS,
	abstract: true
})
export abstract class NodeBehaviorBase<Type extends NodeBehaviorType = NodeBehaviorType>
	implements NodeBehaviorBaseDto
{
	/**
	 * @inheritDoc
	 */
	@Enum({ items: () => NodeBehaviorType, type: () => NodeBehaviorType })
	public readonly type!: Type;

	// The owing side is here, so the primary key is also the foreign key
	@OneToOne(() => Node, {
		eager: false,
		hidden: true,
		onDelete: "cascade",
		onUpdateIntegrity: "cascade",
		owner: true,
		primary: true
	})
	public readonly node?: Node;
}
