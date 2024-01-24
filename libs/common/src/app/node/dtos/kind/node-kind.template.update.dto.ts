import {
	IntersectionType,
	OmitType,
	PartialType,
	PickType
} from "@nestjs/mapped-types";

import { NODE_KIND_DISCRIMINATOR_KEY } from "./node-kind.base.dto";
import { NodeKindTemplateDto } from "./node-kind.template.dto";

/**
 * Class to update a "node-kind" of `template` type
 */
export class NodeKindTemplateUpdateDto extends IntersectionType(
	PickType(NodeKindTemplateDto, [NODE_KIND_DISCRIMINATOR_KEY]),
	PartialType(OmitType(NodeKindTemplateDto, [NODE_KIND_DISCRIMINATOR_KEY]))
) {}
