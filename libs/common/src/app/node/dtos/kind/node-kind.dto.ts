import type { Type } from "@nestjs/common";

import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindEdgeDto } from "./node-kind.edge.dto";
import { NodeKindEdgeUpdateDto } from "./node-kind.edge.update.dto";
import { NodeKindTemplateDto } from "./node-kind.template.dto";
import { NodeKindTemplateUpdateDto } from "./node-kind.template.update.dto";

/**
 * All the possible node kinds  (to generate type and subTypes)
 */
export const NODE_KIND_DTOS = [
	NodeKindEdgeDto,
	NodeKindTemplateDto
] as const satisfies ReadonlyArray<Type<NodeKindBaseDto>>;

/**
 * All the possible node kinds for update
 */
export const NODE_KIND_UPDATE_DTOS = [
	NodeKindEdgeUpdateDto,
	NodeKindTemplateUpdateDto
] as const satisfies ReadonlyArray<Type<NodeKindBaseDto>>;

/**
 * The union type of all behaviors
 */
export type NodeKindDto = InstanceType<(typeof NODE_KIND_DTOS)[number]>;
export type NodeKindUpdateDto = InstanceType<(typeof NODE_KIND_UPDATE_DTOS)[number]>;
