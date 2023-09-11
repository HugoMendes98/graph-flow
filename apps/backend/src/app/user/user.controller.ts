import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	UserCreateDto,
	UserDto,
	UserQueryDto,
	UserResultsDto,
	UserUpdateDto
} from "~/lib/common/app/user/dtos";
import { UserEndpoint, USERS_ENDPOINT_PREFIX } from "~/lib/common/app/user/endpoints";

import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UseAuth } from "../auth/auth.guard";

/**
 * The main controller for [users]{@link UserDto}.
 */
@ApiTags("Users")
@Controller(USERS_ENDPOINT_PREFIX)
@UseAuth()
export class UserController implements UserEndpoint<UserEntity> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: UserService) {}

	/** @inheritDoc */
	@ApiOkResponse({ type: UserResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: UserQueryDto) {
		return this.service.findAndCount(where, params);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: UserDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	/** @inheritDoc */
	@ApiCreatedResponse({ type: UserDto })
	@Post()
	public create(@Body() body: UserCreateDto) {
		return this.service.create(body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: UserDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: UserUpdateDto) {
		return this.service.update(id, body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: UserDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
