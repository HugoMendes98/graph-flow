import { NODE_BEHAVIOR_ENTITIES, NodeBehaviorBase } from "./behaviors";
import { NodeBehaviorParameterBase } from "./behaviors/parameters";
import { NodeInput } from "./input";
import { NODE_KIND_ENTITIES, NodeKindBaseEntity } from "./kind";
import { Node } from "./node.entity";
import { NodeOutput } from "./output";

/**
 * All entities (classes) linked to {@link Node}
 */
export const NODE_ENTITIES = [
	Node,

	// Behavior
	NodeBehaviorBase,
	NodeBehaviorParameterBase,
	...NODE_BEHAVIOR_ENTITIES,

	NodeKindBaseEntity,
	...NODE_KIND_ENTITIES,

	// Input/Output
	NodeInput,
	NodeOutput
];
