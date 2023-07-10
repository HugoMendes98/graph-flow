import { IsEnum } from "class-validator";

import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../_lib/dto";

export abstract class NodeBehaviorBase {
	public static get TYPE() {
		return this.prototype.type;
	}

	/**
	 * A unique identifier that determines the behavior.
	 *
	 * It must be defined when extended.
	 */
	@DtoProperty()
	@IsEnum(NodeBehaviorType)
	public abstract readonly type: NodeBehaviorType;
}

export type NodeBehaviorDiscriminatorKey = keyof Pick<NodeBehaviorBase, "type">;
