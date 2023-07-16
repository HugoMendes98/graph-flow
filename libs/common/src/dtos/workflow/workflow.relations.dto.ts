import { WorkflowDto } from "./workflow.dto";
import { DtoProperty } from "../_lib/dto";
import { GraphRelationsDto } from "../graph";

/**
 * The class representing a [workflow]{@link WorkflowDto} with its relations.
 *
 * Mainly used for filtering/ordering
 */
export class WorkflowRelationsDto extends WorkflowDto {
	@DtoProperty({ forwardRef: true, type: () => GraphRelationsDto })
	public graph?: GraphRelationsDto;
}
