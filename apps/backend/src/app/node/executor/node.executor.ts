import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { filter, lastValueFrom, toArray } from "rxjs";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { castNodeIoValueTo, NODE_IO_VOID, NodeIoType, NodeIoValue } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeExecutorMissingInputException } from "./exceptions";
import { GraphExecutor } from "../../graph/executor/graph.executor";
import type {
	GraphExecuteResolutionEndState,
	GraphExecuteState
} from "../../graph/executor/graph.executor.state";
import {
	NodeBehaviorVariable,
	NodeBehaviorCode,
	NodeBehaviorFunction,
	NodeBehaviorReference
} from "../behaviors";
import { NodeBehaviorTrigger } from "../behaviors/node-behavior.trigger";
import { NodeInputEntity } from "../input/node-input.entity";
import { NodeEntity } from "../node.entity";
import { NodeService } from "../node.service";
import { NodeOutputEntity } from "../output/node-output.entity";
import { NodeOutputRepository } from "../output/node-output.repository";

/**
 * The output from an executed node with its value
 */
export interface NodeOutputAndValue {
	/**
	 * The output the value is applied to
	 */
	output: NodeOutputEntity;
	/**
	 * The value of the output
	 */
	value: NodeIoValue;
}

/**
 * A map of inputs for a node execution
 */
export type NodeInputAndValues = ReadonlyMap<EntityId, NodeIoValue>;

/**
 * The parameters for executing a node
 */
export interface NodeExecuteParameters {
	/**
	 * The node to execute
	 */
	node: NodeEntity;
	/**
	 * The values connected to its inputs
	 */
	valuedInputs: NodeInputAndValues;
}

/** @internal */
interface NodeInputAndValue {
	input: NodeInputEntity;
	/**
	 * The value of the input
	 */
	value: NodeIoValue;
}

@Injectable()
export class NodeExecutor {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param outputRepository injected
	 * @param graphExecutor injected
	 */
	public constructor(
		private readonly service: NodeService,
		private readonly outputRepository: NodeOutputRepository,
		@Inject(forwardRef(() => GraphExecutor))
		private readonly graphExecutor: GraphExecutor
	) {}

	/**
	 * Executes a node
	 *
	 * Notes:
	 *	- The output values are cast to its type
	 * 	- A `node-code` could have no output (but should not happen, by default: a void)
	 * 	- `parameters` (for function) only "transmits" the values
	 * 	    - from the input function to the output parameters (inside the function graph)
	 * 	    - from the input parameter to the output function (leave the function graph)
	 *
	 * @param params The parameters to execute a node
	 * @returns All the {@link NodeOutputEntity} affected with their value
	 */
	public async execute(params: NodeExecuteParameters): Promise<NodeOutputAndValue[]> {
		const { node, valuedInputs } = params;
		const { behavior, inputs, outputs } = node;

		const getValues = () =>
			inputs
				.getItems()
				.filter(({ __node }) => __node === node._id)
				.map<NodeInputAndValue>(input => {
					if (input.type === NodeIoType.VOID) {
						return { input, value: NODE_IO_VOID };
					}

					const { _id } = input;
					const value = valuedInputs.get(_id);
					if (value === undefined) {
						throw new NodeExecutorMissingInputException(_id);
					}

					return { input, value };
				});

		switch (behavior.type) {
			case NodeBehaviorType.CODE: {
				// Always execute the node
				const value = await this.executeCode(
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
				return this.executeFunction(behavior, node, valuedInputs);

			case NodeBehaviorType.TRIGGER:
				return this.executeTrigger(behavior, node);

			case NodeBehaviorType.VARIABLE:
				return [{ output: outputs[0], value: this.executeVariable(behavior) }];

			case NodeBehaviorType.REFERENCE:
				return this.executeReference(behavior, node, getValues());

			case NodeBehaviorType.PARAMETER_IN: {
				const [output] = outputs;
				const value = valuedInputs.get(behavior.__node_input);
				if (value === undefined) {
					throw new NodeExecutorMissingInputException(node._id);
				}

				return [{ output, value }];
			}

			case NodeBehaviorType.PARAMETER_OUT: {
				const [{ value }] = getValues();

				return [
					{
						output: await this.outputRepository.findOneOrFail({
							_id: behavior.__node_output
						}),
						value
					}
				];
			}
		}
	}

	private executeCode(behavior: NodeBehaviorCode, inputs: readonly NodeIoValue[]) {
		// TODO: better
		type Fn = (...inputs: NodeIoValue[]) => Promise<NodeIoValue>;
		return (eval(behavior.code) as Fn)(...inputs);
	}

	private async executeFunction(
		behavior: NodeBehaviorFunction,
		node: NodeEntity,
		inputs: NodeInputAndValues
	): Promise<NodeOutputAndValue[]> {
		const { data: parametersIn } = await this.service.findByGraph(behavior.__graph, {
			$or: [
				{ behavior: { type: NodeBehaviorType.PARAMETER_IN } },
				{
					behavior: {
						node: { behavior: { type: NodeBehaviorType.PARAMETER_IN } },
						type: NodeBehaviorType.REFERENCE
					}
				}
			]
		});

		// TODO: a way to access the observable from the outside?
		// Get the state observable
		const executeState$ = await this.graphExecutor.execute({
			graphId: behavior.__graph,
			inputs,
			startAt: parametersIn.map(({ _id }) => _id)
		});

		const { outputs } = node;
		const outputIds = outputs.getItems().map(({ _id }) => _id);

		// Get all finished states only about the `node-parameter-out`
		//  As written above, the execution of `node-parameter-out` "outputs" to the referenced output
		return lastValueFrom(
			executeState$.pipe(
				filter(
					(state: GraphExecuteState): state is GraphExecuteResolutionEndState =>
						state.type === "resolution-end" && outputIds.includes(state.node._id)
				),
				toArray()
			)
		).then(states => states.flatMap(({ outputs }) => outputs));
	}

	private async executeReference(
		behavior: NodeBehaviorReference,
		node: NodeEntity,
		valuedInputs: readonly NodeInputAndValue[]
	): Promise<NodeOutputAndValue[]> {
		return this.execute({
			node: await this.service.findById(behavior.__node),
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- An error will be thrown if there is a missing input
			valuedInputs: new Map(valuedInputs.map(({ input, value }) => [input.__ref!, value]))
		}).then(outputs => {
			const values = new Map(
				outputs.map(({ output, value }) => [output._id, value] as const)
			);

			return (
				node.outputs
					.getItems()
					.filter(({ __ref }) => __ref && values.has(__ref))
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Ok thanks from `filter`
					.map(output => ({ output, value: values.get(output.__ref!)! }))
			);
		});
	}

	private executeTrigger(behavior: NodeBehaviorTrigger, node: NodeEntity): NodeOutputAndValue[] {
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
