import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { EntityId } from "../dtos/_lib/entity";
import { GraphDto } from "../dtos/graph";
import { WorkflowCreateDto, WorkflowDto, WorkflowUpdateDto } from "../dtos/workflow";

/**
 * Endpoint path for [workflows]{@link WorkflowDto} (without global prefix).
 */
export const WORKFLOWS_ENDPOINT_PREFIX = "/v1/workflows";

export type Workflow = Jsonify<WorkflowDto>;
export interface WorkflowEndpoint<Serialized extends boolean = false>
	extends EntityEndpoint<
		Serialized extends true ? Workflow : WorkflowDto,
		WorkflowCreateDto,
		WorkflowUpdateDto
	> {
	/**
	 * Loads the graph of the given workflow.
	 * This is equivalent to loading directly the graph.
	 *
	 * @param id the workflow id
	 * @returns the graph
	 */
	lookForGraph(id: EntityId): Promise<Serialized extends true ? Jsonify<GraphDto> : GraphDto>;
}

/**
 * The endpoint to load the graph of a workflow
 */
export const WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT = "/graph";
