import { Entity, Enum, PrimaryKey } from "@mikro-orm/core";
import {
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorType
} from "~/app/common/dtos/node/behaviors";

@Entity({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeBehaviorDiscriminatorKey,
	tableName: "node_behavior"
})
export abstract class NodeBehaviorBase<Type extends NodeBehaviorType = NodeBehaviorType>
	implements NodeBehaviorBaseDto
{
	@Enum({ items: () => NodeBehaviorType })
	public readonly type!: Type;

	@PrimaryKey({ autoincrement: true })
	protected readonly _id!: number;
}
