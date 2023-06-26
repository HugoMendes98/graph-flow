import { Injectable } from "@angular/core";
import { Jsonify } from "type-fest";
import { GroupCreateDto, GroupRelationsDto, GroupUpdateDto } from "~/app/common/dtos/group";
import { GroupEndpoint, Group, GROUPS_ENDPOINT_PREFIX } from "~/app/common/endpoints";

import { EntityApiService } from "../_lib/entity-api";

@Injectable({
	providedIn: "root"
})
export class GroupApiService
	extends EntityApiService<Group, GroupCreateDto, GroupUpdateDto, Jsonify<GroupRelationsDto>>
	implements GroupEndpoint<true>
{
	public override getEntrypoint(): string {
		return GROUPS_ENDPOINT_PREFIX;
	}
}
