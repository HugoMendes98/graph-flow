import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	GroupCreateDto,
	GroupDto,
	GroupQueryDto,
	GroupResultsDto,
	GroupUpdateDto
} from "~/app/common/dtos/group";
import { GroupEndpoint, GROUPS_ENDPOINT_PREFIX } from "~/app/common/endpoints";

import { GroupService } from "./group.service";

/**
 * The main controller for [groups]{@link GroupDto}.
 */
@ApiTags("Groups")
@Controller(GROUPS_ENDPOINT_PREFIX)
export class GroupController implements GroupEndpoint {
	public constructor(private readonly service: GroupService) {}

	@ApiOkResponse({ type: GroupResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: GroupQueryDto) {
		return this.service.findAndCount(where, params);
	}

	@ApiOkResponse({ type: GroupDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	@ApiCreatedResponse({ type: GroupDto })
	@Post()
	public create(@Body() body: GroupCreateDto) {
		return this.service.create(body);
	}

	@ApiOkResponse({ type: GroupDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: GroupUpdateDto) {
		return this.service.update(id, body);
	}

	@ApiOkResponse({ type: GroupDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
