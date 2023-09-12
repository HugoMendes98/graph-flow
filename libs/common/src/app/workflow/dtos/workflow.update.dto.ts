import { IntersectionType, PartialType, PickType } from "@nestjs/mapped-types";

import { WorkflowCreateDto } from "./workflow.create.dto";
import { WorkflowDto } from "./workflow.dto";

/**
 * DTO used to update [workflows]{@link WorkflowDto}
 * in its {@link WorkflowEndpoint endpoint}.
 */
export class WorkflowUpdateDto extends PartialType(
	IntersectionType(WorkflowCreateDto, PickType(WorkflowDto, ["active"]))
) {}
