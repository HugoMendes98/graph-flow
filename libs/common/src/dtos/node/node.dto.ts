import type { Type } from "@nestjs/common";
import { Type as TypeTransformer } from "class-transformer";
import { IsString, MinLength, ValidateNested } from "class-validator";

import {
	NodeBehaviorBase,
	NodeBehaviorCodeDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorFunctionDto,
	NodeBehaviorVariableDto
} from "./node-behaviors";
import { DtoProperty } from "../_lib/dto";
import { EntityDto } from "../_lib/entity";

/**
 * All the possible node behaviors (to generate type and subTypes)
 */
const nodeBehaviors = [
	NodeBehaviorCodeDto,
	NodeBehaviorFunctionDto,
	NodeBehaviorVariableDto
] as const satisfies ReadonlyArray<Type<NodeBehaviorBase>>;

/**
 * The union type of all node behaviors
 */
export type NodeBehaviorDto = InstanceType<(typeof nodeBehaviors)[number]>;

/**
 * DTO for node entities.
 *
 * (This is for node templates, not nodes in a graph)
 */
export class NodeDto extends EntityDto {
	/**
	 * The name (not unique of a node)
	 */
	@DtoProperty()
	@IsString()
	@MinLength(2)
	public name!: string;

	// TODO: color?
	// TODO: number of inputs/outputs (calculated/determined from the behavior)

	/**
	 * The behavior of a node defines how it works on a graph.
	 *
	 * Its content should not be used for something else,
	 * possible useful content should be extract and be available in the flatten node DTO.
	 */
	// FIXME: Find query with anything that is not in the base type will probably fail
	//	`type(): DtoType` should have a parameter of the raw data
	@DtoProperty() // TODO: APIProperty with `anyOf`?
	@TypeTransformer(() => NodeBehaviorBase, {
		discriminator: {
			property: "type" satisfies NodeBehaviorDiscriminatorKey,
			subTypes: nodeBehaviors.map(behavior => ({ name: behavior.TYPE, value: behavior }))
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public behavior!: NodeBehaviorDto;
}
