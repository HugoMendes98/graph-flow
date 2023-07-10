import { Embeddable, Embedded } from "@mikro-orm/core";
import { NodeBehaviorTriggerDto as DTO, NodeBehaviorType } from "~/app/common/dtos/node/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NODE_TRIGGER_ENTITIES, NodeTrigger } from "./triggers";

const type = NodeBehaviorType.TRIGGER;

@Embeddable({ discriminatorValue: type })
export class NodeBehaviorTrigger extends NodeBehaviorBase implements DTO {
	public override readonly type = type;

	@Embedded(() => NODE_TRIGGER_ENTITIES, { object: true })
	public readonly trigger!: NodeTrigger;
}
