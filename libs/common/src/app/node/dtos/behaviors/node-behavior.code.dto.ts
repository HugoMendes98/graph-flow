import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";

/**
 * Behavior of a node when it executes some code
 */
export class NodeBehaviorCodeDto extends NodeBehaviorBaseDto {
	/**
	 * @inheritDoc
	 */
	public override readonly type = NodeBehaviorType.CODE;

	// TODO: languages, source code (, dependencies, docker, ...)
}
