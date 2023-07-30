import { UserDto } from "~/lib/common/app/user/dtos";
import { USERS_ENDPOINT_PREFIX } from "~/lib/common/app/user/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class UserHttpClient extends EntityHttpClient<UserDto> {
	public override getEndpoint(): string {
		return USERS_ENDPOINT_PREFIX;
	}
}
