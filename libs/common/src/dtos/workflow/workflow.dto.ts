import { IsString, MinLength } from "class-validator";

import { DtoProperty } from "../_lib/dto";
import { EntityDto } from "../_lib/entity";

/**
 * DTO for workflow entities
 */
export class WorkflowDto extends EntityDto {
	/**
	 * The unique name of a workflow
	 */
	@DtoProperty()
	@IsString()
	@MinLength(2)
	public name!: string;

	// TODO: link a workflow to categories?
}
