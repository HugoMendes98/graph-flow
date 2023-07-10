import { Type as TypeTransformer } from "class-transformer";
import { IsString, MinLength, ValidateNested } from "class-validator";

import {
	NODE_BEHAVIOR_DTOS,
	NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorDto
} from "./behaviors";
import { DtoProperty } from "../_lib/dto";
import { EntityDto } from "../_lib/entity";

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
	@TypeTransformer(() => NodeBehaviorBaseDto, {
		discriminator: {
			property: "type" satisfies NodeBehaviorDiscriminatorKey,
			subTypes: NODE_BEHAVIOR_DTOS.map(behavior => ({
				name: behavior.TYPE,
				value: behavior
			}))
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly behavior!: NodeBehaviorDto;
}
