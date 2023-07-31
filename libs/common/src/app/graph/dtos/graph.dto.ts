import { GraphNodeDto } from "./node/graph-node.dto";
import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";
import { WorkflowDto } from "../../workflow/dtos/workflow.dto";

export class GraphDto extends EntityDto {
	// Probably just empty
	// TODO: viewport ?

	// ------- Relations -------

	/**
	 * The nodes that are linked to this graph
	 */
	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => GraphNodeDto
	})
	public readonly nodes?: GraphNodeDto[];

	/**
	 * The possible linked workflow
	 */
	@DtoProperty({
		forwardRef: true,
		nullable: true,
		type: () => WorkflowDto
	})
	public readonly workflow?: WorkflowDto | null;
}
