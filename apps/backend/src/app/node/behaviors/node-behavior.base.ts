import { Entity, Enum, PrimaryKey } from "@mikro-orm/core";
import {
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorType
} from "~/lib/common/dtos/node/behaviors";

@Entity({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeBehaviorDiscriminatorKey,
	tableName: "node_behavior"
})
export abstract class NodeBehaviorBase<Type extends NodeBehaviorType = NodeBehaviorType>
	implements NodeBehaviorBaseDto
{
	@PrimaryKey({ autoincrement: true, hidden: true })
	protected readonly _id!: number;

	@Enum({ items: () => NodeBehaviorType })
	public readonly type!: Type;
}
