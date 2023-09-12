import type { NodeInputAndValues, NodeOutputAndValue } from "../../node/executor/node.executor";
import type { NodeEntity } from "../../node/node.entity";

interface GraphExecuteStateDiscriminated<T extends string> {
	/**
	 * Unique type to discriminate states
	 */
	type: T;
}

export interface GraphExecuteNodeStartingState
	extends GraphExecuteStateDiscriminated<"node-starting"> {
	inputs: NodeInputAndValues;
	/**
	 * The current this states is about
	 */
	node: NodeEntity;
}
export interface GraphExecuteNodeFinishState
	extends Omit<GraphExecuteNodeStartingState, "type">,
		GraphExecuteStateDiscriminated<"node-finish"> {
	/**
	 * The outputs that were treated by the current state
	 */
	outputs: NodeOutputAndValue[];
}

export type GraphExecuteState = GraphExecuteNodeFinishState | GraphExecuteNodeStartingState;
