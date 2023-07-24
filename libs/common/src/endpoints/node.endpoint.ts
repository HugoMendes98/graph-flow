import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { DtoToEntity } from "../dtos/_lib/entity/entity.types";
import { NodeCreateDto, NodeDto, NodeUpdateDto } from "../dtos/node";

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
