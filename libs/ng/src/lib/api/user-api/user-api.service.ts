import { Injectable } from "@angular/core";
import { UserCreateDto, UserUpdateDto } from "~/lib/common/dtos/user";
import { User, UserEndpoint, USERS_ENDPOINT_PREFIX } from "~/lib/common/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the user API.
 */
@Injectable({
	providedIn: "root"
})
export class UserApiService
	extends EntityApiService<User, UserCreateDto, UserUpdateDto>
	implements UserEndpoint
{
	public override getEntrypoint(): string {
		return USERS_ENDPOINT_PREFIX;
	}
}
