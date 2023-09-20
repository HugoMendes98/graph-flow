import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type as TypeTransformer } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import {
	NODE_KIND_UPDATE_DTOS,
	NodeKindBaseDto,
	NodeKindDiscriminatorKey,
	NodeKindUpdateDto
} from "./kind";
import { NodeCreateDto } from "./node.create.dto";

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
			subTypes: NODE_KIND_UPDATE_DTOS.map(kind => ({
				name: kind.TYPE,
				value: kind
			}))
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly kind?: NodeKindUpdateDto;
}
