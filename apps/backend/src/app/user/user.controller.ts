import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	UserCreateDto,
	UserDto,
	UserQueryDto,
	UserResultsDto,
	UserUpdateDto
} from "~/lib/common/dtos/user";
import { UserEndpoint, USERS_ENDPOINT_PREFIX } from "~/lib/common/endpoints";

import { UserService } from "./user.service";

/**
 * The main controller for [users]{@link UserDto}.
 */
@ApiTags("Users")
@Controller(USERS_ENDPOINT_PREFIX)
export class UserController implements UserEndpoint {
	public constructor(private readonly service: UserService) {}

	@ApiOkResponse({ type: UserResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: UserQueryDto) {
		return this.service.findAndCount(where, params);
	}

	@ApiOkResponse({ type: UserDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	@ApiCreatedResponse({ type: UserDto })
	@Post()
	public create(@Body() body: UserCreateDto) {
		return this.service.create(body);
	}

	@ApiOkResponse({ type: UserDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: UserUpdateDto) {
		return this.service.update(id, body);
	}

	@ApiOkResponse({ type: UserDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
