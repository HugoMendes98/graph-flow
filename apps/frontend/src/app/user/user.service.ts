import { Injectable } from "@angular/core";
import { UserDto } from "~/lib/common/app/user/dtos";

@Injectable({ providedIn: "root" })
export class UserService {
	/**
	 * Displays a name for the given user
	 *
	 * @param user to display
	 * @returns a display-name
	 */
	public displayName(user: UserDto) {
		// TODO: static?
		const { email, firstname, lastname } = user;

		if (firstname && lastname) {
			return `${firstname} ${lastname}`;
		}

		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- It really is `truthy || otherwise`
		return lastname || firstname || email;
	}
}
