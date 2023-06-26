import { Jsonify } from "type-fest";

import { EntityEndpoint } from "./_lib";
import { GroupUpdateDto, GroupDto, GroupCreateDto, GroupRelationsDto } from "../dtos/group";

/**
 * Endpoint path for [groups]{@link GroupDto} (without global prefix).
 */
export const GROUPS_ENDPOINT_PREFIX = "/v1/groups";

export type Group = Jsonify<GroupDto>;
export type GroupEndpoint<Serialized extends boolean = false> = EntityEndpoint<
	Serialized extends true ? Group : GroupDto,
	GroupCreateDto,
	GroupUpdateDto,
	Serialized extends true ? Jsonify<GroupRelationsDto> : GroupRelationsDto
>;
