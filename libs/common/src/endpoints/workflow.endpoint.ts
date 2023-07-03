import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { WorkflowCreateDto, WorkflowDto, WorkflowUpdateDto } from "../dtos/workflow";

/**
 * Endpoint path for [workflows]{@link WorkflowDto} (without global prefix).
 */
export const WORKFLOWS_ENDPOINT_PREFIX = "/v1/workflows";

export type Workflow = Jsonify<WorkflowDto>;
export type WorkflowEndpoint<Serialized extends boolean = false> = EntityEndpoint<
	Serialized extends true ? Workflow : WorkflowDto,
	WorkflowCreateDto,
	WorkflowUpdateDto
>;
