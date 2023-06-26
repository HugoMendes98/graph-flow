import { GroupDto } from "~/app/common/dtos/group";
import { GROUPS_ENDPOINT_PREFIX } from "~/app/common/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class GroupHttpClient extends EntityHttpClient<GroupDto> {
	public override getEndpoint(): string {
		return GROUPS_ENDPOINT_PREFIX;
	}
}
