import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";
import { WorkflowDto } from "../../workflow/dtos/workflow.dto";

/**
 * DTO for the graph, used to link every content
 */
export class GraphDto extends EntityDto {
	// Probably just empty
	// TODO: viewport ?

	// ------- Relations -------

	/**
	 * The possible linked workflow
	 */
	@DtoProperty({ nullable: true, type: () => WorkflowDto })
	public readonly workflow?: WorkflowDto | null;
}
