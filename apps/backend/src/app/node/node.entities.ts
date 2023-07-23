import { NODE_BEHAVIOR_ENTITIES, NodeBehaviorBase } from "./behaviors";
import { NodeBehaviorParameterBase } from "./behaviors/parameters";
import { NodeInput } from "./input";
import { Node } from "./node.entity";
import { NodeOutput } from "./output";

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
