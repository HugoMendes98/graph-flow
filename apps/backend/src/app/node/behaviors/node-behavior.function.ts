import { Entity } from "@mikro-orm/core";
import { GraphNodeDto } from "~/lib/common/app/graph/dtos/node";
import {
	NodeBehaviorFunctionDto as DTO,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { Graph } from "../../graph/graph.entity";

const type = NodeBehaviorType.FUNCTION;

const GraphProperty = ManyToOneFactory(() => Graph, {
	fieldName: "__graph" satisfies keyof GraphNodeDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ discriminatorValue: type })
export class NodeBehaviorFunction extends NodeBehaviorBase<typeof type> implements DTO {
	// public override readonly type = type;

	@GraphProperty({ foreign: false })
	public readonly __graph!: number;

	@GraphProperty({ foreign: true })
	public readonly graph?: Graph;
}
