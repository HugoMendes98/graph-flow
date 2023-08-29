import { Jsonify } from "type-fest";

import { DtoToEntity } from "../../../dtos/entity/entity.types";
import { EntityReadEndpoint } from "../../../endpoints";
import { GraphDto } from "../dtos";

/**
 * Endpoint path for [graphs]{@link GraphDto} (without global prefix).
 */
export const GRAPHS_ENDPOINT_PREFIX = "/v1/graphs";

export type Graph = Jsonify<GraphDto>;
export type GraphEndpoint<T extends DtoToEntity<GraphDto> | Graph = Graph> = EntityReadEndpoint<T>;
