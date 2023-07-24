import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	CategoryCreateDto,
	CategoryDto,
	CategoryQueryDto,
	CategoryResultsDto,
	CategoryUpdateDto
} from "~/lib/common/dtos/category";
import { CATEGORIES_ENDPOINT_PREFIX, CategoryEndpoint } from "~/lib/common/endpoints";

import { Category } from "./category.entity";
import { CategoryService } from "./category.service";

/**
 * The main controller for [categories]{@link CategoryDto}.
 */
@ApiTags("Categories")
@Controller(CATEGORIES_ENDPOINT_PREFIX)
export class CategoryController implements CategoryEndpoint<Category> {
	public constructor(private readonly service: CategoryService) {}

	@ApiOkResponse({ type: CategoryResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: CategoryQueryDto) {
		return this.service.findAndCount(where, params);
	}

	@ApiOkResponse({ type: CategoryDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	@ApiCreatedResponse({ type: CategoryDto })
	@Post()
	public create(@Body() body: CategoryCreateDto) {
		return this.service.create(body);
	}

	@ApiOkResponse({ type: CategoryDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: CategoryUpdateDto) {
		return this.service.update(id, body);
	}

	@ApiOkResponse({ type: CategoryDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
