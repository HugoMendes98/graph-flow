import { Type as TypeTransformer } from "class-transformer";
import { IsString, MinLength, ValidateNested } from "class-validator";

import {
	NODE_BEHAVIOR_DISCRIMINATOR_KEY,
	NodeBehaviorBaseDto
} from "./behaviors/node-behavior.base.dto";
import { NodeBehaviorDto, NODE_BEHAVIOR_DTOS } from "./behaviors/node-behavior.dto";
import { NodeInputDto } from "./input/node-input.dto";
import { NODE_KIND_DISCRIMINATOR_KEY, NodeKindBaseDto } from "./kind/node-kind.base.dto";
import { NODE_KIND_DTOS, NodeKindDto } from "./kind/node-kind.dto";
import { NodeOutputDto } from "./output/node-output.dto";
import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";
import { CategoryDto } from "../../category/dtos/category.dto";

/**
 * DTO for node entities.
 *
 * (This is for node templates, not nodes in a graph)
 */
export class NodeDto extends EntityDto {
	/**
	 * The name of a node
	 */
	@DtoProperty()
	@IsString()
	@MinLength(2)
	public name!: string;

	/**
	 * The behavior of a node defines how it works on a graph.
	 *
	 * Its content should not be used for something else,
	 * possible useful content should be extract and be available in the flatten node DTO.
	 */
	// FIXME: Find query with anything that is not in the base type will probably fail
	@DtoProperty() // TODO: APIProperty with `anyOf`?
	@TypeTransformer(() => NodeBehaviorBaseDto, {
		discriminator: {
			property: NODE_BEHAVIOR_DISCRIMINATOR_KEY,
			subTypes: NODE_BEHAVIOR_DTOS.slice()
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly behavior!: NodeBehaviorDto;

	/**
	 * The kind of this node
	 */
	@DtoProperty()
	@TypeTransformer(() => NodeKindBaseDto, {
		discriminator: {
			property: NODE_KIND_DISCRIMINATOR_KEY,
			subTypes: NODE_KIND_DTOS.slice()
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly kind!: NodeKindDto;

	// ------- Relations -------

	/**
	 * All [inputs]{@link NodeInputDto} linked to this node.
	 *
	 * Automatically managed most of the time
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => NodeInputDto
	})
	public readonly inputs!: readonly NodeInputDto[];
	/**
	 * All [outputs]{@link NodeOutputDto} linked to this node.
	 *
	 * Automatically managed most of the time
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => NodeOutputDto
	})
	public readonly outputs!: readonly NodeOutputDto[];

	/**
	 * All [categories]{@link CategoryDto} linked to this node
	 *
	 * Note: Node is the owning side
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => CategoryDto
	})
	public readonly categories?: readonly CategoryDto[];
}
