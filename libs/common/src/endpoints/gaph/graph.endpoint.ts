import { Jsonify } from "type-fest";

import { DtoToEntity } from "../../dtos/_lib/entity/entity.types";
import { GraphDto } from "../../dtos/graph";
import { EntityReadEndpoint } from "../_lib";

/**
 * Endpoint path for [graphs]{@link GraphDto} (without global prefix).
 */
export const GRAPHS_ENDPOINT_PREFIX = "/v1/graphs";

export type Graph = Jsonify<GraphDto>;
export type GraphEndpoint<T extends DtoToEntity<GraphDto> | Graph> = EntityReadEndpoint<T>;
