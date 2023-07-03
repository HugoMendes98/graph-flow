import { PartialType } from "@nestjs/mapped-types";

import { WorkflowCreateDto } from "./workflow.create.dto";

/**
 * DTO used to update [workflows]{@link WorkflowDto}
 * in its {@link WorkflowEndpoint endpoint}.
 */
export class WorkflowUpdateDto extends PartialType(WorkflowCreateDto) {}
