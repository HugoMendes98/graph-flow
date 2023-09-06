import { Jsonify } from "type-fest";

import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityEndpoint } from "../../../endpoints";
import { NodeCreateDto, NodeDto, NodeUpdateDto } from "../dtos";

/**
 * Endpoint path for [nodes]{@link NodeDto} (without global prefix).
 */
export const NODES_ENDPOINT_PREFIX = "/v1/nodes";

export type Node = Jsonify<NodeDto>;
export type NodeEndpoint<T extends DtoToEntity<NodeDto> | Node = Node> = EntityEndpoint<
	T,
	NodeCreateDto,
	NodeUpdateDto
>;
