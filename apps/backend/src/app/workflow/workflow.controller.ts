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
import { GraphDto } from "~/lib/common/app/graph/dtos";
import {
	WorkflowCreateDto,
	WorkflowDto,
	WorkflowQueryDto,
	WorkflowResultsDto,
	WorkflowUpdateDto
} from "~/lib/common/app/workflow/dtos";
import {
	WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT,
	WorkflowEndpoint,
	WORKFLOWS_ENDPOINT_PREFIX
} from "~/lib/common/app/workflow/endpoints";

import { WorkflowEntity } from "./workflow.entity";
import { WorkflowService } from "./workflow.service";
import { UseAuth } from "../auth/auth.guard";
import { GraphService } from "../graph/graph.service";

/**
 * The main controller for [workflows]{@link WorkflowDto}.
 */
@ApiTags("Workflows")
@Controller(WORKFLOWS_ENDPOINT_PREFIX)
@UseAuth()
export class WorkflowController implements WorkflowEndpoint<WorkflowEntity> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 * @param graphService injected
	 */
	public constructor(
		private readonly service: WorkflowService,
		private readonly graphService: GraphService
	) {}

	/** @inheritDoc */
	@ApiOkResponse({ type: WorkflowResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: WorkflowQueryDto) {
		return this.service.findAndCount(where, params);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: WorkflowDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	/** @inheritDoc */
	@ApiCreatedResponse({ type: WorkflowDto })
	@Post()
	public create(@Body() body: WorkflowCreateDto) {
		return this.service.create(body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: WorkflowDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: WorkflowUpdateDto) {
		return this.service.update(id, body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: WorkflowDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}

	/**
	 * Loads the graph of the given workflow.
	 * This is equivalent to loading directly the graph.
	 *
	 * @param id the workflow id
	 * @returns the graph
	 */
	@ApiOkResponse({ type: GraphDto })
	@Get(`/:id${WORKFLOW_LOOK_FOR_GRAPH_ENDPOINT}`)
	public lookForGraph(@Param("id") id: number) {
		return this.findById(id).then(({ __graph }) =>
			this.graphService.findById(__graph)
		);
	}
}
