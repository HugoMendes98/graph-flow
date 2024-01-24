import {
	UserJSON,
	USERS_ENDPOINT_PREFIX
} from "~/lib/common/app/user/endpoints";

import { EntityHttpClient } from "./_lib/entity.http-client";

export class UserHttpClient extends EntityHttpClient<UserJSON> {
	public override getEndpoint(): string {
		return USERS_ENDPOINT_PREFIX;
	}
}
