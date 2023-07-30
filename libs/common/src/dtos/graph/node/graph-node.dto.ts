import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";

import { GraphNodeInputDto } from "./input/graph-node-input.dto";
import { GraphNodeOutputDto } from "./output/graph-node-output.dto";
import { PositionDto } from "./position.dto";
import { DtoProperty } from "../../_lib/dto";
import { EntityDto, EntityId } from "../../_lib/entity";
import { NodeDto } from "../../node/node.dto";
import { GraphDto } from "../graph.dto";

/**
 * A [GraphNode]{@link GraphNodeDto} represents the membership of a [Node]{@link NodeDto} to a [Graph]{@link GraphDto}.
 *
 * It also contains some descriptive information, but it is only used for its visual representation
 */
export class GraphNodeDto extends EntityDto {
	/**
	 * The [graph]{@link GraphDto} on which it is
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __graph!: EntityId;

	/**
	 * The [Node]{@link NodeDto} being represented
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __node!: EntityId;

	/**
	 * The name of a node on the graph.
	 *
	 * It does not replace the node's name,
	 * but allows to differentiate if multiple identical are present.
	 *
	 * @default the same name as the node
	 */
	@DtoProperty()
	@IsOptional()
	@IsString()
	@MinLength(2)
	public name!: string;

	/**
	 * The position of the node in a 2D plan
	 */
	@DtoProperty()
	@Type(() => PositionDto)
	@ValidateNested()
	public position!: PositionDto;

	// ------- Relations -------

	@DtoProperty({ array: true, forwardRef: true, type: () => GraphNodeInputDto })
	public readonly inputs!: GraphNodeInputDto[];
	@DtoProperty({ array: true, forwardRef: true, type: () => GraphNodeOutputDto })
	public readonly outputs!: GraphNodeOutputDto[];

	@DtoProperty({ forwardRef: true, type: () => GraphDto })
	public readonly graph?: GraphDto;

	@DtoProperty({ forwardRef: true, type: () => NodeDto })
	public readonly node?: NodeDto;
}
