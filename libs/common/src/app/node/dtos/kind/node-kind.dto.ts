import type { Type } from "@nestjs/common";

import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindEdgeDto } from "./node-kind.edge.dto";
import { NodeKindEdgeUpdateDto } from "./node-kind.edge.update.dto";
import { NodeKindTemplateDto } from "./node-kind.template.dto";
import { NodeKindTemplateUpdateDto } from "./node-kind.template.update.dto";
import { NodeKindType } from "./node-kind.type";
import { DiscriminatedType } from "../../../../types";

/**
 * All the possible node kinds  (to generate type and subTypes)
 */
export const NODE_KIND_DTOS = [
	{ name: NodeKindType.EDGE, value: NodeKindEdgeDto },
	{ name: NodeKindType.TEMPLATE, value: NodeKindTemplateDto }
] as const satisfies ReadonlyArray<DiscriminatedType<Type<NodeKindBaseDto>, NodeKindType>>;

/**
 * All the possible node kinds for update
 */
export const NODE_KIND_UPDATE_DTOS = [
	{ name: NodeKindType.EDGE, value: NodeKindEdgeUpdateDto },
	{ name: NodeKindType.TEMPLATE, value: NodeKindTemplateUpdateDto }
] as const satisfies ReadonlyArray<DiscriminatedType<Type<NodeKindBaseDto>, NodeKindType>>;

/**
 * The union type of all kinds
 */
export type NodeKindDto = InstanceType<(typeof NODE_KIND_DTOS)[number]["value"]>;
/**
 * The union type of all "update-kind"s
 */
export type NodeKindUpdateDto = InstanceType<(typeof NODE_KIND_UPDATE_DTOS)[number]["value"]>;
