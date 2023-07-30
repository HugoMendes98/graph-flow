import { Embedded, Entity } from "@mikro-orm/core";
import {
	NodeBehaviorTriggerDto as DTO,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NODE_TRIGGER_ENTITIES, NodeTrigger } from "./triggers";

const type = NodeBehaviorType.TRIGGER;

@Entity({ discriminatorValue: type })
export class NodeBehaviorTrigger extends NodeBehaviorBase<typeof type> implements DTO {
	@Embedded(() => NODE_TRIGGER_ENTITIES, { object: true })
	public readonly trigger!: NodeTrigger;
}
