import type { Type } from "@nestjs/common";

import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindTemplateDto } from "./node-kind.template.dto";
import { NodeKindTemplateUpdateDto } from "./node-kind.template.update.dto";
import { NodeKindType } from "./node-kind.type";
import { NodeKindVertexDto } from "./node-kind.vertex.dto";
import { NodeKindVertexUpdateDto } from "./node-kind.vertex.update.dto";
import { DiscriminatedType } from "../../../../types";

/**
 * All the possible node kinds  (to generate type and subTypes)
 */
export const NODE_KIND_DTOS = [
	{ name: NodeKindType.VERTEX, value: NodeKindVertexDto },
	{ name: NodeKindType.TEMPLATE, value: NodeKindTemplateDto }
] as const satisfies ReadonlyArray<DiscriminatedType<Type<NodeKindBaseDto>, NodeKindType>>;

/**
 * All the possible node kinds for update
 */
export const NODE_KIND_UPDATE_DTOS = [
	{ name: NodeKindType.VERTEX, value: NodeKindVertexUpdateDto },
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
