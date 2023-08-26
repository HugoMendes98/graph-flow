import { Injectable } from "@nestjs/common";
import { NodeDto } from "~/lib/common/app/node/dtos";
import {
	NodeBehaviorCodeDto,
	NodeBehaviorFunctionDto,
	NodeBehaviorType,
	NodeBehaviorVariableDto
} from "~/lib/common/app/node/dtos/behaviors";
import { NodeInputDto } from "~/lib/common/app/node/dtos/input";
import { NodeIoTypes } from "~/lib/common/app/node/dtos/io";
import { NodeOutputDto } from "~/lib/common/app/node/dtos/output";

export interface NodeInputValue extends Pick<NodeInputDto, "_id"> {
	/**
	 * The value of the input
	 */
	value: NodeIoTypes;
}

export interface NodeOutputValue extends NodeOutputDto {
	/**
	 * The value of the output
	 */
	value: NodeIoTypes;
}

@Injectable()
export class NodeExecutor {
	public async execute(
		node: NodeDto,
		inputValues: readonly NodeInputValue[]
	): Promise<NodeOutputValue[]> {
		const { behavior, inputs, outputs } = node;

		switch (behavior.type) {
			case NodeBehaviorType.CODE:
				this.executeCode(behavior);
				break;
			case NodeBehaviorType.FUNCTION:
				this.executeFunction(behavior);
				break;

			case NodeBehaviorType.VARIABLE: {
				const [output] = outputs;
				return [{ ...output, value: this.executeVariable(behavior) }];
			}
		}

		return Promise.reject();
	}

	protected executeCode(behavior: NodeBehaviorCodeDto, inputs: NodeIoTypes[]): NodeIoTypes {
		// TODO: better
		return (eval(behavior.code) as (...inputs: NodeIoTypes[]) => NodeIoTypes)(...inputs);
	}

	protected executeFunction(behavior: NodeBehaviorFunctionDto) {}

	protected executeVariable(behavior: NodeBehaviorVariableDto) {
		return behavior.value;
	}
}
