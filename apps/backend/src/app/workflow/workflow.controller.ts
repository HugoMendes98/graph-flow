import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	WorkflowCreateDto,
	WorkflowDto,
	WorkflowQueryDto,
	WorkflowResultsDto,
	WorkflowUpdateDto
} from "~/app/common/dtos/workflow";
import { WorkflowEndpoint, WORKFLOWS_ENDPOINT_PREFIX } from "~/app/common/endpoints";

import { WorkflowService } from "./workflow.service";

/**
 * The main controller for [workflows]{@link WorkflowDto}.
 */
@ApiTags("Workflows")
@Controller(WORKFLOWS_ENDPOINT_PREFIX)
export class WorkflowController implements WorkflowEndpoint {
	public constructor(private readonly service: WorkflowService) {}

	@ApiOkResponse({ type: WorkflowResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: WorkflowQueryDto) {
		return this.service.findAndCount(where, params);
	}

	@ApiOkResponse({ type: WorkflowDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	@ApiCreatedResponse({ type: WorkflowDto })
	@Post()
	public create(@Body() body: WorkflowCreateDto) {
		return this.service.create(body);
	}

	@ApiOkResponse({ type: WorkflowDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: WorkflowUpdateDto) {
		return this.service.update(id, body);
	}

	@ApiOkResponse({ type: WorkflowDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
