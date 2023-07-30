import { WorkflowDto } from "./workflow.dto";
import { FindResultsDtoOf } from "../../../dtos/find-results.dto";

/**
 * DTO results when listing [workflow]{@link WorkflowDto}.
 */
export class WorkflowResultsDto extends FindResultsDtoOf(WorkflowDto) {}
