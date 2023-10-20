import type { NodeOutputAndValue } from "../../node/executor/node.executor";
import type { NodeEntity } from "../../node/node.entity";

interface GraphExecuteStateDiscriminated<T extends string> {
	/**
	 * The current node of the state
	 */
	node: NodeEntity;
	/**
	 * Unique type to discriminate states
	 */
	type: T;
}

/**
 * When a node starts its resolution
 */
export type GraphExecuteResolutionStartState = GraphExecuteStateDiscriminated<"resolution-start">;

/**
 * When a node ends its resolution (after being executed)
 */
export interface GraphExecuteResolutionEndState
	extends GraphExecuteStateDiscriminated<"resolution-end"> {
	/**
	 * The outputs that result from the execution
	 */
	outputs: NodeOutputAndValue[];
}

/**
 * When a node enters the flow propagation process.
 * After it has been resolved, before propagation
 */
export type GraphExecutePropagationEnterState = GraphExecuteStateDiscriminated<"propagation-enter">;
/**
 * When a node leave the flow propagation process.
 * After it has been resolved, after propagation
 */
export type GraphExecutePropagationLeaveState = GraphExecuteStateDiscriminated<"propagation-leave">;

export type GraphExecuteState =
	| GraphExecutePropagationEnterState
	| GraphExecutePropagationLeaveState
	| GraphExecuteResolutionEndState
	| GraphExecuteResolutionStartState;
export type GraphExecuteStateType = GraphExecuteState["type"];
