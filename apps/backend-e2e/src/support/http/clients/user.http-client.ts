import { UserDto } from "~/lib/common/dtos/user";
import { USERS_ENDPOINT_PREFIX } from "~/lib/common/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class UserHttpClient extends EntityHttpClient<UserDto> {
	public override getEndpoint(): string {
		return USERS_ENDPOINT_PREFIX;
	}
}
