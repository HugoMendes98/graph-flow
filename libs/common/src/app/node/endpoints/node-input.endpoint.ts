import { Node, NODES_ENDPOINT_PREFIX } from "./node.endpoint";
import { EntityId } from "../../../dtos/entity";
import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { NodeInputCreateDto, NodeInputDto, NodeInputUpdateDto } from "../dtos/input";

/**
 * Endpoint path parts for [nodes]{@link NodeInputDto} (without global prefix).
 * The parameter goes in the middle starting with a `/`.
 */
export const NODE_INPUTS_ENDPOINT_PARTS = [NODES_ENDPOINT_PREFIX, "/inputs"] as const;

/**
 * Generates the endpoint for `node-input`s for a node.
 *
 * @param nodeId the of the node
 * @returns The endpoint prefix with the given nodeId
 */
export function generateNodeInputsEndpoint(nodeId: EntityId) {
	const [start, end] = NODE_INPUTS_ENDPOINT_PARTS;
	return `${start}/${nodeId}${end}`;
}

export type NodeInput = Node["inputs"][number];
export type NodeInputEndpoint<T extends DtoToEntity<NodeInputDto> | NodeInput = NodeInput> = Pick<
	EntityEndpoint<T, NodeInputCreateDto, NodeInputUpdateDto>,
	"create" | "delete" | "update"
>;
