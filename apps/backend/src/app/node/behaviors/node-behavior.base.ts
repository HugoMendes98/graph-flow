import { Entity, EntityOptions, Enum, PrimaryKey } from "@mikro-orm/core";
import {
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorType
} from "~/lib/common/dtos/node/behaviors";

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
	@PrimaryKey({ autoincrement: true, hidden: true })
	protected readonly _id!: number;

	@Enum({ items: () => NodeBehaviorType, type: () => NodeBehaviorType })
	public readonly type!: Type;
}
