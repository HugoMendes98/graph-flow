import { IsString, MinLength } from "class-validator";

import { NodeBehaviorBaseDto } from "./node-behavior.base.dto";
import { NodeBehaviorType } from "./node-behavior.type";
import { DtoProperty } from "../../../../dtos/dto";

/**
 * Behavior of a node when it executes some code
 */
export class NodeBehaviorCodeDto extends NodeBehaviorBaseDto {
	/** @inheritDoc */
	public override readonly type = NodeBehaviorType.CODE;

	// TODO: languages, source code (, dependencies, docker, ...)

	// TODO: this is temporary
	@DtoProperty()
	@IsString()
	@MinLength(3)
	public code!: string;
}
