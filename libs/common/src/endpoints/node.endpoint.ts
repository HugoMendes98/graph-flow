import { Jsonify } from "type-fest";
import { NodeCreateDto, NodeDto, NodeUpdateDto } from "~/app/common/dtos/node";

import { EntityEndpoint } from "./_lib";

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
