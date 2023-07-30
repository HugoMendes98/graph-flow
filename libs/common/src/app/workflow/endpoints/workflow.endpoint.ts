import { Jsonify } from "type-fest";

import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { GraphDto } from "../../graph/dtos";
import { WorkflowCreateDto, WorkflowDto, WorkflowUpdateDto } from "../dtos";

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
