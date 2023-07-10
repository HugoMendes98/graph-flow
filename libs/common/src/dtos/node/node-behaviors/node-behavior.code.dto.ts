import { NodeBehaviorBase } from "./node-behavior.base";
import { NodeBehaviorType } from "./node-behavior.type";

export class NodeBehaviorCodeDto extends NodeBehaviorBase {
	public readonly type = NodeBehaviorType.CODE;

	// TODO: languages, source code (, dependencies, docker, ...)
}
