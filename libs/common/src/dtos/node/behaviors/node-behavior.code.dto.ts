import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";

export class NodeBehaviorCodeDto extends NodeBehaviorBaseDto {
	public override readonly type = NodeBehaviorType.CODE;

	// TODO: languages, source code (, dependencies, docker, ...)
}
