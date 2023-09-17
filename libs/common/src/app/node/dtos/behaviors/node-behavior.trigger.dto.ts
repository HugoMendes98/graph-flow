import { Type as TypeTransformer } from "class-transformer";
import { ValidateNested } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import {
	NodeTriggerBaseDto,
	NodeTriggerDiscriminatorKey,
	NODE_TRIGGER_DTOS,
	NodeTriggerDto
} from "./triggers";
import { DtoProperty } from "../../../../dtos/dto";

/**
 * Behavior of a node that is a trigger
 */
export class NodeBehaviorTriggerDto extends NodeBehaviorBaseDto {
	/** @inheritDoc */
	public override readonly type = NodeBehaviorType.TRIGGER;

	/**
	 * The trigger behavior of the node
	 */
	@DtoProperty() // TODO: APIProperty with `anyOf`?
	@TypeTransformer(() => NodeTriggerBaseDto, {
		discriminator: {
			property: "type" satisfies NodeTriggerDiscriminatorKey,
			subTypes: NODE_TRIGGER_DTOS.map(trigger => ({
				name: trigger.TYPE,
				value: trigger
			}))
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly trigger!: NodeTriggerDto;

	// TODO ?
}
