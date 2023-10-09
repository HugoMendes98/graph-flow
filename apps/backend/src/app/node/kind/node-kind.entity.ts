import { Type } from "@nestjs/common";

import { NodeKindBaseEntity } from "./node-kind.base.entity";
import { NodeKindTemplateEntity } from "./node-kind.template.entity";
import { NodeKindVertexEntity } from "./node-kind.vertex.entity";

/**
 * All subtypes for node kind
 */
export const NODE_KIND_ENTITIES = [
	NodeKindVertexEntity,
	NodeKindTemplateEntity
] as const satisfies ReadonlyArray<Type<NodeKindBaseEntity>>;

/**
 * The union type of all node kind
 */
export type NodeKindEntity = InstanceType<(typeof NODE_KIND_ENTITIES)[number]>;
