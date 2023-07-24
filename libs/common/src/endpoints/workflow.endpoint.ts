import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { EntityId } from "../dtos/_lib/entity";
import { DtoToEntity } from "../dtos/_lib/entity/entity.types";
import { GraphDto } from "../dtos/graph";
import { WorkflowCreateDto, WorkflowDto, WorkflowUpdateDto } from "../dtos/workflow";

/**
 * Endpoint path for [workflows]{@link WorkflowDto} (without global prefix).
 */
export const WORKFLOWS_ENDPOINT_PREFIX = "/v1/workflows";

export type Workflow = Jsonify<WorkflowDto>;
export interface WorkflowEndpoint<T extends DtoToEntity<WorkflowDto> | Workflow = Workflow>
	extends EntityEndpoint<T, WorkflowCreateDto, WorkflowUpdateDto> {
	/**
	 * Loads the graph of the given workflow.
	 * This is equivalent to loading directly the graph.
	 *
	 * @param id the workflow id
	 * @returns the graph
	 */
	lookForGraph(
		id: EntityId
	): Promise<T extends Workflow ? Jsonify<GraphDto> : DtoToEntity<GraphDto>>;
}

/**
 * The endpoint to load the graph of a workflow
 */
export const WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT = "/graph";
