import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type as TypeTransformer } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { NODE_KIND_DTOS, NodeKindBaseDto, NodeKindDiscriminatorKey, NodeKindDto } from "./kind";
import { NodeCreateDto } from "./node.create.dto";

export type NodeKindUpdateDto = Partial<NodeKindDto> & Pick<NodeKindDto, "type">;

/**
 * DTO used to update [node]{@link NodeDto}
 * in its {@link NodeEndpoint endpoint}.
 *
 * Can not change the type of `kind`
 */
export class NodeUpdateDto extends PartialType(OmitType(NodeCreateDto, ["behavior", "kind"])) {
	@IsOptional()
	@TypeTransformer(() => NodeKindBaseDto, {
		discriminator: {
			property: "type" satisfies NodeKindDiscriminatorKey,
			subTypes: NODE_KIND_DTOS.map(kind => ({
				name: kind.TYPE,
				value: PartialType(kind as never)
			}))
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly kind?: NodeKindUpdateDto;
}
