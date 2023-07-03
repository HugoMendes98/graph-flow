import { Injectable } from "@angular/core";
import { UserCreateDto, UserUpdateDto } from "~/app/common/dtos/user";
import { User, UserEndpoint, USERS_ENDPOINT_PREFIX } from "~/app/common/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the user API.
 */
@Injectable({
	providedIn: "root"
})
export class UserApiService
	extends EntityApiService<User, UserCreateDto, UserUpdateDto>
	implements UserEndpoint<true>
{
	public override getEntrypoint(): string {
		return USERS_ENDPOINT_PREFIX;
	}
}
