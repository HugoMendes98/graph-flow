import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { NodeCreateDto, NodeDto, NodeUpdateDto } from "../dtos/node";

/**
 * Endpoint path for [nodes]{@link NodeDto} (without global prefix).
 */
export const NODES_ENDPOINT_PREFIX = "/v1/nodes";

export type Node = Jsonify<NodeDto>;
export type NodeEndpoint<Serialized extends boolean = false> = EntityEndpoint<
	Serialized extends true ? Node : NodeDto,
	NodeCreateDto,
	NodeUpdateDto
>;
