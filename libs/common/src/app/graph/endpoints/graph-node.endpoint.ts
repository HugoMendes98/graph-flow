import { GRAPHS_ENDPOINT_PREFIX } from "./graph.endpoint";
import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { NodeCreateDto, NodeDto, NodeUpdateDto } from "../../node/dtos";
import { NodeKindEdgeDto } from "../../node/dtos/kind";

/**
 * Endpoint path parts for [nodes]{@link NodeDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const GRAPH_NODES_ENDPOINT_PARTS = [GRAPHS_ENDPOINT_PREFIX, "/nodes"] as const;

/**
 * Generates the endpoint for `graph-node`s for a graph.
 *
 * @param graphId the of the graph
 * @returns The endpoint prefix with the given graphId
 */
export function generateGraphNodesEndpoint(graphId: EntityId) {
	const [start, end] = GRAPH_NODES_ENDPOINT_PARTS;
	return `${start}/${graphId}${end}`;
}

export type GraphNodeDto = Omit<NodeDto, "kind"> &
	Record<keyof Pick<NodeDto, "kind">, NodeKindEdgeDto>;
export type GraphNodeEndpoint<T extends DtoToEntity<NodeDto> | GraphNodeDto = GraphNodeDto> =
	EntityEndpoint<T, NodeCreateDto, NodeUpdateDto>;
