import { Injectable } from "@nestjs/common";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { castNodeIoValueTo, NODE_IO_VOID, NodeIoValue } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";

import {
	NodeExecutorMissingInputException,
	NodeExecutorNotExecutableException
} from "./exceptions";
import { NodeBehaviorCode, NodeBehaviorFunction } from "../behaviors";
import { NodeBehaviorTrigger } from "../behaviors/node-behavior.trigger";
import { NodeBehaviorVariable } from "../behaviors/parameters";
import { NodeInput } from "../input";
import { Node } from "../node.entity";
import { NodeOutput } from "../output";

export interface NodeOutputAndValue {
	/**
	 * The output the value is applied to
	 */
	output: NodeOutput;
	/**
	 * The value of the output
	 */
	value: NodeIoValue;
}

/**
 * @internal
 */
interface NodeInputAndValue {
	input: NodeInput;
	/**
	 * The value of the input
	 */
	value: NodeIoValue;
}

export type NodeInputAndValues = ReadonlyMap<EntityId, NodeIoValue>;

export interface NodeExecuteParams {
	node: Node;
	valuedInputs: NodeInputAndValues;
}

@Injectable()
export class NodeExecutor {
	/**
	 *
	 * Notes:
	 *	- The output values are cast to its type
	 * 	- A `node-code` could have no output (but should not happen, by default a void)
	 * 	- "parameters" can not be executed and are managed by their graph-executor
	 *
	 * @param params
	 */
	public async execute(params: NodeExecuteParams): Promise<NodeOutputAndValue[]> {
		const { node, valuedInputs } = params;
		const { behavior, inputs, outputs } = node;

		const getValues = () =>
			inputs.getItems().map<NodeInputAndValue>(input => {
				if (input.type === "void") {
					return { input, value: NODE_IO_VOID };
				}

				const value = valuedInputs.get(input._id);
				if (value === undefined) {
					throw new NodeExecutorMissingInputException(input._id);
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
				return [{ output, value: castNodeIoValueTo(output.type, value) }];
			}

			case NodeBehaviorType.FUNCTION:
				return this.executeFunction(behavior, node);

			case NodeBehaviorType.TRIGGER:
				return this.executeTrigger(behavior, node);

			case NodeBehaviorType.VARIABLE:
				return [{ output: outputs[0], value: this.executeVariable(behavior) }];

			case NodeBehaviorType.PARAMETER_IN:
			case NodeBehaviorType.PARAMETER_OUT:
				throw new NodeExecutorNotExecutableException(node._id);
		}
	}

	private executeCode(behavior: NodeBehaviorCode, inputs: NodeIoValue[]): NodeIoValue {
		// TODO: better
		return (eval(behavior.code) as (...inputs: NodeIoValue[]) => NodeIoValue)(...inputs);
	}

	private executeFunction(
		behavior: NodeBehaviorFunction,
		node: Node
	): Promise<NodeOutputAndValue[]> {
		return Promise.reject();
	}

	private executeTrigger(behavior: NodeBehaviorTrigger, node: Node): NodeOutputAndValue[] {
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
