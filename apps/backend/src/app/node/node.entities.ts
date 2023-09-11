import { NODE_BEHAVIOR_ENTITIES, NodeBehaviorBase } from "./behaviors";
import { NodeBehaviorParameterBase } from "./behaviors/parameters";
import { NodeInputEntity } from "./input";
import { NODE_KIND_ENTITIES, NodeKindBaseEntity } from "./kind";
import { NodeEntity } from "./node.entity";
import { NodeOutputEntity } from "./output";

/**
 * All entities (classes) linked to {@link NodeEntity}
 */
export const NODE_ENTITIES = [
	NodeEntity,

	// Behavior
	NodeBehaviorBase,
	NodeBehaviorParameterBase,
	...NODE_BEHAVIOR_ENTITIES,

	NodeKindBaseEntity,
	...NODE_KIND_ENTITIES,

	// Input/Output
	NodeInputEntity,
	NodeOutputEntity
];
