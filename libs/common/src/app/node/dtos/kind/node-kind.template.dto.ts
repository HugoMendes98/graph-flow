import { IsBoolean } from "class-validator";

import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindType } from "./node-kind.type";
import { DtoProperty } from "../../../../dtos/dto";

export class NodeKindTemplateDto extends NodeKindBaseDto {
	public override readonly type = NodeKindType.TEMPLATE;

	/**
	 * If the template is active
	 */
	@DtoProperty()
	@IsBoolean()
	public readonly active!: boolean;
}
