import { IntersectionType, OmitType, PickType } from "@nestjs/mapped-types";

import { WorkflowDto } from "./workflow.dto";
import { ENTITY_BASE_KEYS } from "../_lib/entity";

/**
 * The mandatory keys to create a [workflow]{@link WorkflowDto}.
 */
export const WORKFLOW_CREATE_KEYS_MANDATORY = ["name"] as const satisfies ReadonlyArray<
	keyof WorkflowDto
>;

/**
 * DTO used to create [workflow]{@link WorkflowDto}
 * in its {@link WorkflowEndpoint endpoint}.
 */
export class WorkflowCreateDto extends IntersectionType(
	PickType(WorkflowDto, WORKFLOW_CREATE_KEYS_MANDATORY),
	OmitType(WorkflowDto, [...ENTITY_BASE_KEYS, ...WORKFLOW_CREATE_KEYS_MANDATORY])
) {}
