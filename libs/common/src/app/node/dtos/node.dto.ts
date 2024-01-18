import { IsString, MinLength, ValidateNested } from "class-validator";

import {
	NODE_BEHAVIOR_DISCRIMINATOR_KEY,
	NodeBehaviorBaseDto
} from "./behaviors/node-behavior.base.dto";
import {
	NODE_BEHAVIOR_DTOS,
	NodeBehaviorDto
} from "./behaviors/node-behavior.dto";
import { NodeInputDto } from "./input/node-input.dto";
import {
	NODE_KIND_DISCRIMINATOR_KEY,
	NodeKindBaseDto
} from "./kind/node-kind.base.dto";
import { NODE_KIND_DTOS, NodeKindDto } from "./kind/node-kind.dto";
import { NodeOutputDto } from "./output/node-output.dto";
import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";
import { CategoryDto } from "../../category/dtos/category.dto";

/** Minimal length for a node's name */
export const NODE_NAME_MIN_LENGTH = 2;

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
	@MinLength(NODE_NAME_MIN_LENGTH)
	public name!: string;

	/**
	 * The behavior of a node defines how it works on a graph.
	 *
	 * Its content should not be used for something else,
	 * possible useful content should be extract and be available in the flatten node DTO.
	 */
	// FIXME: Find query with anything that is not in the base type will probably fail
	@DtoProperty({
		discriminator: {
			property: NODE_BEHAVIOR_DISCRIMINATOR_KEY,
			subTypes: NODE_BEHAVIOR_DTOS.slice()
		},
		type: () => NodeBehaviorBaseDto
	})
	@ValidateNested()
	public readonly behavior!: NodeBehaviorDto;

	/**
	 * The kind of this node
	 */
	@DtoProperty({
		discriminator: {
			property: NODE_KIND_DISCRIMINATOR_KEY,
			subTypes: NODE_KIND_DTOS.slice()
		},
		type: () => NodeKindBaseDto
	})
	@ValidateNested()
	public readonly kind!: NodeKindDto;

	// ------- Relations -------

	/**
	 * All [inputs]{@link NodeInputDto} linked to this node.
	 *
	 * Automatically managed most of the time
	 */
	@DtoProperty({ array: true, type: () => NodeInputDto })
	public readonly inputs!: readonly NodeInputDto[];
	/**
	 * All [outputs]{@link NodeOutputDto} linked to this node.
	 *
	 * Automatically managed most of the time
	 */
	@DtoProperty({ array: true, type: () => NodeOutputDto })
	public readonly outputs!: readonly NodeOutputDto[];

	/**
	 * All [categories]{@link CategoryDto} linked to this node
	 *
	 * Note: Node is the owning side
	 */
	@DtoProperty({ array: true, type: () => CategoryDto })
	public readonly categories?: readonly CategoryDto[];
}
