import { NODE_BEHAVIOR_ENTITIES, NodeBehaviorBase } from "./behaviors";
import { NodeBehaviorParameterBase } from "./behaviors/parameters";
import { NodeInput } from "./input";
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

	// Input/Output
	NodeInput,
	NodeOutput
];
