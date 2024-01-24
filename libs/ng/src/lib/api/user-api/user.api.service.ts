import { Injectable } from "@angular/core";
import { UserCreateDto, UserUpdateDto } from "~/lib/common/app/user/dtos";
import {
	UserJSON,
	UserEndpoint,
	USERS_ENDPOINT_PREFIX
} from "~/lib/common/app/user/endpoints";

import { EntityApiService } from "../_lib/entity-api";

/**
 * Service to communicate with the user API.
 */
@Injectable({ providedIn: "root" })
export class UserApiService
	extends EntityApiService<UserJSON, UserCreateDto, UserUpdateDto>
	implements UserEndpoint
{
	public override getEntrypoint(): string {
		return USERS_ENDPOINT_PREFIX;
	}
}
