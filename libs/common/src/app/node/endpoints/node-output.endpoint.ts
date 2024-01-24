import { NodeJSON, NODES_ENDPOINT_PREFIX } from "./node.endpoint";
import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import {
	NodeOutputCreateDto,
	NodeOutputDto,
	NodeOutputUpdateDto
} from "../dtos/output";

/**
 * Endpoint path parts for [nodes]{@link NodeOutputDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const NODE_OUTPUTS_ENDPOINT_PARTS = [
	NODES_ENDPOINT_PREFIX,
	"/outputs"
] as const;

/**
 * Generates the endpoint for `node-output`s for a node.
 *
 * @param nodeId the of the node
 * @returns The endpoint prefix with the given nodeId
 */
export function generateNodeOutputsEndpoint(nodeId: EntityId) {
	const [start, end] = NODE_OUTPUTS_ENDPOINT_PARTS;
	return `${start}/${nodeId}${end}`;
}

export type NodeOutputJSON = NodeJSON["outputs"][number];
export type NodeOutputEndpoint<
	T extends DtoToEntity<NodeOutputDto> | NodeOutputJSON = NodeOutputJSON
> = Pick<EntityEndpoint<T, NodeOutputCreateDto, NodeOutputUpdateDto>, "update">;
