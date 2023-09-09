import { Injectable } from "@nestjs/common";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { castNodeIoValueTo, NODE_IO_VOID, NodeIoType, NodeIoValue } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";

import {
	GraphExecutorMissingInputException,
	GraphExecutorNotExecutableException
} from "./exceptions";
import { NodeBehaviorCode, NodeBehaviorFunction } from "../../node/behaviors";
import { NodeBehaviorTrigger } from "../../node/behaviors/node-behavior.trigger";
import { NodeBehaviorVariable } from "../../node/behaviors/parameters";
import { GraphNode } from "../node/graph-node.entity";
import { GraphNodeInput } from "../node/input";
import { GraphNodeOutput } from "../node/output";

export interface GraphNodeOutputAndValue {
	/**
	 * The output the value is applied to
	 */
	output: GraphNodeOutput;
	/**
	 * The value of the output
	 */
	value: NodeIoValue;
}

/**
 * @internal
 */
interface GraphNodeInputAndValue {
	input: GraphNodeInput;
	/**
	 * The value of the input
	 */
	value: NodeIoValue;
}

export type GraphNodeInputAndValues = ReadonlyMap<EntityId, NodeIoValue>;
export interface GraphNodeExecuteParams {
	node: GraphNode;
	valuedInputs: GraphNodeInputAndValues;
}

@Injectable()
export class GraphNodeExecutor {
	public async execute(params: GraphNodeExecuteParams): Promise<GraphNodeOutputAndValue[]> {
		const { node, valuedInputs } = params;
		const {
			inputs,
			node: { behavior },
			outputs
		} = node;

		const getValues = () =>
			inputs.getItems().map<GraphNodeInputAndValue>(input => {
				if (input.nodeInput.type === NodeIoType.VOID) {
					return { input, value: NODE_IO_VOID };
				}

				const { _id } = input;
				const value = valuedInputs.get(_id);
				if (value === undefined) {
					throw new GraphExecutorMissingInputException(_id);
				}

				return { input, value };
			});

		switch (behavior.type) {
			case NodeBehaviorType.CODE: {
				// Always execute the node
				const value = this.executeCode(
					behavior,
					getValues().map(({ value }) => value)
				);

				if (!outputs.length) {
					return [];
				}

				const [output] = outputs;
				return [{ output, value: castNodeIoValueTo(output.nodeOutput.type, value) }];
			}

			case NodeBehaviorType.FUNCTION:
				return this.executeFunction(behavior, node);

			case NodeBehaviorType.TRIGGER:
				return this.executeTrigger(behavior, node);

			case NodeBehaviorType.VARIABLE:
				return [{ output: outputs[0], value: this.executeVariable(behavior) }];

			case NodeBehaviorType.PARAMETER_IN:
			case NodeBehaviorType.PARAMETER_OUT:
				throw new GraphExecutorNotExecutableException(node._id);
		}
	}

	private executeCode(behavior: NodeBehaviorCode, inputs: NodeIoValue[]): NodeIoValue {
		// TODO: better
		return (eval(behavior.code) as (...inputs: NodeIoValue[]) => NodeIoValue)(...inputs);
	}

	private executeFunction(
		behavior: NodeBehaviorFunction,
		node: GraphNode
	): Promise<GraphNodeOutputAndValue[]> {
		return Promise.reject();
	}

	private executeTrigger(
		behavior: NodeBehaviorTrigger,
		node: GraphNode
	): GraphNodeOutputAndValue[] {
		const { trigger } = behavior;
		const { outputs } = node;

		switch (trigger.type) {
			case NodeTriggerType.CRON:
				return [{ output: outputs[0], value: new Date().getTime() }];
		}
	}

	private executeVariable(behavior: NodeBehaviorVariable) {
		return behavior.value;
	}
}
