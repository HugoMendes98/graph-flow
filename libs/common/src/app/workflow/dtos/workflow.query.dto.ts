import { WorkflowDto } from "./workflow.dto";
import { FindQueryDtoOf } from "../../../dtos/find-query.dto";

/**
 * DTO Query used to filter [workflow]{@link WorkflowDto}
 * in its {@link WorkflowEndpoint endpoint}.
 */
export class WorkflowQueryDto extends FindQueryDtoOf(WorkflowDto) {}
