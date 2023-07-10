import { Embeddable } from "@mikro-orm/core";
import {
	NodeBehaviorFunctionDto as DTO,
	NodeBehaviorType
} from "~/app/common/dtos/node/node-behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.FUNCTION;

@Embeddable({ discriminatorValue: type })
export class NodeBehaviorFunction extends NodeBehaviorBase implements DTO {
	public override readonly type = type;
}
