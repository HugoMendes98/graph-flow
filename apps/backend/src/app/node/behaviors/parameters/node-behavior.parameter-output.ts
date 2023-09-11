import { Entity } from "@mikro-orm/core";
import {
	NodeBehaviorParameterOutputDto,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors";

import { NodeBehaviorParameterBase } from "./node-behavior.parameter-base";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeOutputEntity } from "../../output";

const OutputProperty = ManyToOneFactory(() => NodeOutputEntity, {
	fieldName: "__node_output" satisfies keyof NodeBehaviorParameterOutputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ discriminatorValue: NodeBehaviorType.PARAMETER_OUT })
export class NodeBehaviorParameterOutput
	extends NodeBehaviorParameterBase<NodeBehaviorType.PARAMETER_OUT>
	implements NodeBehaviorParameterOutputDto
{
	/**
	 * @inheritDoc
	 */
	@OutputProperty({ foreign: false })
	public readonly __node_output!: number;

	@OutputProperty({ foreign: true })
	public readonly nodeOutput?: NodeOutputEntity;
}
