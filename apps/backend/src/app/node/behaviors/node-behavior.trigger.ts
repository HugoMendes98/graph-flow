import { Embedded, Entity } from "@mikro-orm/core";
import { NodeBehaviorTriggerDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeBehaviorBase } from "./node-behavior.base";
import { NODE_TRIGGER_ENTITIES, NodeTriggerEntity } from "./triggers";

const type = NodeBehaviorType.TRIGGER;

@Entity({ discriminatorValue: type })
export class NodeBehaviorTrigger extends NodeBehaviorBase<typeof type> implements DTO {
	/** @inheritDoc */
	@Embedded(() => NODE_TRIGGER_ENTITIES, { object: true })
	public readonly trigger!: NodeTriggerEntity;
}
