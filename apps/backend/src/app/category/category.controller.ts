import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	CategoryCreateDto,
	CategoryDto,
	CategoryQueryDto,
	CategoryResultsDto,
	CategoryUpdateDto
} from "~/lib/common/app/category/dtos";
import {
	CATEGORIES_ENDPOINT_PREFIX,
	CategoryEndpoint
} from "~/lib/common/app/category/endpoints";

import { CategoryEntity } from "./category.entity";
import { CategoryService } from "./category.service";
import { UseAuth } from "../auth/auth.guard";

/**
 * The main controller for [categories]{@link CategoryDto}.
 */
@ApiTags("Categories")
@Controller(CATEGORIES_ENDPOINT_PREFIX)
@UseAuth()
export class CategoryController implements CategoryEndpoint<CategoryEntity> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: CategoryService) {}

	/** @inheritDoc */
	@ApiOkResponse({ type: CategoryResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: CategoryQueryDto) {
		return this.service.findAndCount(where, params);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: CategoryDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	/** @inheritDoc */
	@ApiCreatedResponse({ type: CategoryDto })
	@Post()
	public create(@Body() body: CategoryCreateDto) {
		return this.service.create(body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: CategoryDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: CategoryUpdateDto) {
		return this.service.update(id, body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: CategoryDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
