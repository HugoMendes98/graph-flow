import { Pipe, PipeTransform } from "@angular/core";
import { UserDto } from "~/lib/common/app/user/dtos";

import { UserService } from "../user.service";

@Pipe({ name: "userDisplayName", pure: true })
export class UserDisplayNamePipe implements PipeTransform {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: UserService) {}

	/**
	 * @inheritDoc
	 */
	public transform(value: UserDto): string {
		return this.service.displayName(value);
	}
}
