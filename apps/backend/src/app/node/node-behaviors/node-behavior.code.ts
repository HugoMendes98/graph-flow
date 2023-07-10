import { Embeddable } from "@mikro-orm/core";
import { NodeBehaviorCodeDto as DTO, NodeBehaviorType } from "~/app/common/dtos/node/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.CODE;

@Embeddable({ discriminatorValue: type })
export class NodeBehaviorCode extends NodeBehaviorBase implements DTO {
	public override readonly type = type;
}
