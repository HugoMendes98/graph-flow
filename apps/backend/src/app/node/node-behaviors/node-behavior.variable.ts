import { Embeddable } from "@mikro-orm/core";
import {
	NodeBehaviorVariableDto as DTO,
	NodeBehaviorType
} from "~/app/common/dtos/node/node-behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.VARIABLE;

@Embeddable({ discriminatorValue: type })
export class NodeBehaviorVariable extends NodeBehaviorBase implements DTO {
	public override readonly type = type;
}
