import { IsNumber, IsString, MinLength } from "class-validator";

import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";
import { GraphDto } from "../../graph/dtos/graph.dto";

/**
 * DTO for workflow entities
 */
export class WorkflowDto extends EntityDto {
	/**
	 * The foreign key to the [graph]{@link GraphDto} of this workflow.
	 * Automatically set on creation
	 */
	@DtoProperty()
	@IsNumber()
	public readonly __graph!: number;

	/**
	 * The unique name of a workflow
	 */
	@DtoProperty()
	@IsString()
	@MinLength(2)
	public name!: string;

	// TODO: link a workflow to categories?

	// ------- Relations -------

	@DtoProperty({ forwardRef: true, type: () => GraphDto })
	public readonly graph?: GraphDto;
}
