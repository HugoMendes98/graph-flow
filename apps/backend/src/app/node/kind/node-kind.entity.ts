import { Type } from "@nestjs/common";

import { NodeKindBaseEntity } from "./node-kind.base.entity";
import { NodeKindEdgeEntity } from "./node-kind.edge.entity";
import { NodeKindTemplateEntity } from "./node-kind.template.entity";

/**
 * All subtypes for node kind
 */
export const NODE_KIND_ENTITIES = [
	NodeKindEdgeEntity,
	NodeKindTemplateEntity
] as const satisfies ReadonlyArray<Type<NodeKindBaseEntity>>;

/**
 * The union type of all node kind
 */
export type NodeKindEntity = InstanceType<(typeof NODE_KIND_ENTITIES)[number]>;
