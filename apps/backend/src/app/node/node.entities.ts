import { NODE_BEHAVIORS_ENTITIES, NodeBehaviorBase } from "./behaviors";
import { Node } from "./node.entity";

export const NODE_ENTITIES = [Node, NodeBehaviorBase, ...NODE_BEHAVIORS_ENTITIES];
