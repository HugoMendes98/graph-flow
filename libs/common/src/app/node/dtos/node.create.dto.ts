import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";
import { Expose, Type as TypeTransformer } from "class-transformer";
import { ValidateNested } from "class-validator";

import {
	NODE_BEHAVIOR_DISCRIMINATOR_KEY,
	NODE_BEHAVIOR_DTOS,
	NodeBehaviorBaseDto,
	NodeBehaviorDto,
	NodeBehaviorParameterInputDto,
	NodeBehaviorParameterOutputDto
} from "./behaviors";
import { NodeBehaviorType } from "./behaviors/node-behavior.type";
import { NodeDto } from "./node.dto";
import { ENTITY_BASE_KEYS } from "../../../dtos/entity";

/**
 * The mandatory keys to create a [node]{@link NodeDto}.
 */
export const NODE_CREATE_KEYS_MANDATORY = ["kind", "name"] as const satisfies ReadonlyArray<
	keyof NodeDto
>;

/**
 * The possible behaviors when creating
 */
export type NodeCreateBehaviorDto = Exclude<
	NodeBehaviorDto,
	NodeBehaviorParameterInputDto | NodeBehaviorParameterOutputDto
>;

/**
 * DTO used to create [node]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 */
export class NodeCreateDto
	extends IntersectionType(
		PickType(NodeDto, NODE_CREATE_KEYS_MANDATORY),
		OmitType(NodeDto, [
			...ENTITY_BASE_KEYS,
			...NODE_CREATE_KEYS_MANDATORY,
			"behavior",
			"categories",
			"inputs",
			"outputs"
		])
	)
	implements Record<keyof Pick<NodeDto, "behavior">, NodeCreateBehaviorDto>
{
	/**
	 * Parameters can only be created when adding them to a node-function graph
	 */
	@Expose()
	@TypeTransformer(() => NodeBehaviorBaseDto, {
		discriminator: {
			property: NODE_BEHAVIOR_DISCRIMINATOR_KEY,
			subTypes: NODE_BEHAVIOR_DTOS.filter(
				({ name }) =>
					name !== NodeBehaviorType.PARAMETER_IN &&
					name !== NodeBehaviorType.PARAMETER_OUT
			)
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly behavior!: NodeCreateBehaviorDto;
}
