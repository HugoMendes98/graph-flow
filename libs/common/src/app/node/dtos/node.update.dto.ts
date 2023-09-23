import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Expose, Type as TypeTransformer } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import {
	NODE_KIND_DISCRIMINATOR_KEY,
	NODE_KIND_UPDATE_DTOS,
	NodeKindBaseDto,
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
	@Expose()
	@IsOptional()
	@TypeTransformer(() => NodeKindBaseDto, {
		discriminator: {
			property: NODE_KIND_DISCRIMINATOR_KEY,
			subTypes: NODE_KIND_UPDATE_DTOS.slice()
		},
		keepDiscriminatorProperty: true
	})
	@ValidateNested()
	public readonly kind?: NodeKindUpdateDto;
}
