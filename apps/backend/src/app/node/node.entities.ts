import { NODE_BEHAVIOR_ENTITIES, NodeBehaviorBase } from "./behaviors";
import { NodeInputEntity } from "./input/node-input.entity";
import { NODE_KIND_ENTITIES, NodeKindBaseEntity } from "./kind";
import { NodeEntity } from "./node.entity";
import { NodeOutputEntity } from "./output/node-output.entity";

/**
 * All entities (classes) linked to {@link NodeEntity}
 */
export const NODE_ENTITIES = [
	NodeEntity,

	// Behavior
	NodeBehaviorBase,
	...NODE_BEHAVIOR_ENTITIES,

	NodeKindBaseEntity,
	...NODE_KIND_ENTITIES,

	// Input/Output
	NodeInputEntity,
	NodeOutputEntity
];
