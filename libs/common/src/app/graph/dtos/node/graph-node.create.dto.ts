import { OmitType, PickType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { NodeCreateDto, NodeDto } from "../../../node/dtos";
import {
	NODE_BEHAVIOR_DISCRIMINATOR_KEY,
	NODE_BEHAVIOR_DTOS,
	NodeBehaviorBaseDto,
	NodeBehaviorDto
} from "../../../node/dtos/behaviors";
import { NodeKindEdgeDto } from "../../../node/dtos/kind";

/**
 * DTO to use when creating a `node-kind` to a `node` linked to a `graph`
 */
export class GraphNodeKindCreateDto extends PickType(NodeKindEdgeDto, ["position"]) {}

/**
 * DTO to use when creating a `node` linked to a `graph`
 */
export class GraphNodeCreateDto
	extends OmitType(NodeCreateDto, ["behavior", "kind"])
	implements
		Record<keyof Pick<NodeCreateDto, "kind">, GraphNodeKindCreateDto>,
		Pick<NodeDto, "behavior">
{
	@Expose()
	@Type(() => NodeBehaviorBaseDto, {
		discriminator: {
			property: NODE_BEHAVIOR_DISCRIMINATOR_KEY,
			subTypes: NODE_BEHAVIOR_DTOS.slice()
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly behavior!: NodeBehaviorDto;

	/**
	 * The kind of `EDGE` type to create
	 */
	@Expose()
	@Type(() => GraphNodeKindCreateDto)
	@ValidateNested()
	public readonly kind!: GraphNodeKindCreateDto;
}
